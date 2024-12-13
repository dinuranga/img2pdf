document.addEventListener('DOMContentLoaded', function () {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const loadingIndicator = document.getElementById('loading');
    const form = document.getElementById('upload-form');

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Show loading indicator while processing
        loadingIndicator.style.display = 'block';

        const formData = new FormData(form);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator and handle download
            loadingIndicator.style.display = 'none';
            if (data.download_url) {
                // Redirect to the download URL (this will trigger the PDF download)
                window.location.href = data.download_url;
            } else {
                alert('Error generating PDF');
            }
        })
        .catch(error => {
            // Hide loading indicator and show error
            loadingIndicator.style.display = 'none';
            alert('Error uploading images');
        });
    });

    // Drag-and-drop functionality
    dropArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropArea.style.borderColor = '#0056b3';
    });

    dropArea.addEventListener('dragleave', function () {
        dropArea.style.borderColor = '#007bff';
    });

    dropArea.addEventListener('drop', function (e) {
        e.preventDefault();
        dropArea.style.borderColor = '#007bff';

        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', function () {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        const previewContainer = document.getElementById('image-preview-container');
        previewContainer.innerHTML = '';
        for (let file of files) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.width = '100px';
            img.style.height = '100px';
            img.style.margin = '10px';
            previewContainer.appendChild(img);
        }
    }
});
