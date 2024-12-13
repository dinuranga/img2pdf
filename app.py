from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from PIL import Image
from io import BytesIO
import os
import tempfile

# Create the FastAPI app
app = FastAPI()

# Set up templates and static files for HTML interaction
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Use the system's temporary directory for temporary files
temp_dir = tempfile.gettempdir()

@app.get("/", response_class=HTMLResponse)
async def home_page():
    """Display the upload form."""
    return templates.TemplateResponse("index.html", {"request": {}})

@app.post("/upload")
async def upload_images(files: list[UploadFile] = File(...)):
    """Combine uploaded images into a single PDF."""
    image_list = []

    # Process uploaded images
    for file in files:
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert("RGB")
        image_list.append(image)

    # Save the combined PDF
    output_path = os.path.join(temp_dir, "combined.pdf")
    if image_list:
        image_list[0].save(output_path, save_all=True, append_images=image_list[1:])

    return {"download_url": f"/download?file=combined.pdf"}

@app.get("/download")
async def download_file(file: str):
    """Download the generated PDF file."""
    file_path = os.path.join(temp_dir, file)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="application/pdf", filename=file)
    return {"error": "File not found"}

# Cleanup is handled automatically in serverless environments
