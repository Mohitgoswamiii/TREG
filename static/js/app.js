// Handle file input validation
const fileInput = document.getElementById("file-upload");
const uploadForm = document.getElementById("uploadForm");

fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert("File size too large. Please select a file smaller than 2 MB.");
      this.value = "";
    } else {
      // Automatically submit the form when a valid file is selected
      uploadImage(file);
    }
  }
});

// Function to handle the image upload using AJAX
function uploadImage(file) {
  const formData = new FormData(uploadForm);

  fetch("/uploads", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert("Image uploaded successfully!");
      console.log("Prediction result:", data); // Display prediction result
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Handle the slider toggle logic
const slider = document.querySelector(".switch input");
const fileUploadText = document.querySelector(".file-upload-text");
const uploadBtn = document.querySelector(".upload-btn");
const fileInputt = document.querySelector(".file-input");
const maxSize = document.querySelector(".max-size");
const textInput = document.getElementById("text-input");

slider.addEventListener("change", function () {
  if (this.checked) {
    // Hide file upload elements and show text input
    fileUploadText.classList.add("hidden");
    uploadBtn.classList.add("hidden");
    fileInputt.classList.add("hidden");
    maxSize.classList.add("hidden");
    textInput.classList.remove("hidden");
  } else {
    // Show file upload elements and hide text input
    fileUploadText.classList.remove("hidden");
    uploadBtn.classList.remove("hidden");
    fileInputt.classList.remove("hidden");
    maxSize.classList.remove("hidden");
    textInput.classList.add("hidden");
  }
});
