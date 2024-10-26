// Generate Meteors
const meteorCount = 50; // Number of meteors to create
const background = document.querySelector(".background");

if (background) {
  // Check if the background exists before generating meteors
  for (let i = 0; i < meteorCount; i++) {
    const meteor = document.createElement("div");
    meteor.classList.add("meteor");

    // Random position for each meteor
    meteor.style.left = Math.random() * 100 + "vw";
    meteor.style.top = Math.random() * 100 + "vh";

    // Random duration for different speeds
    meteor.style.animationDuration = Math.random() * 2 + 1 + "s";

    background.appendChild(meteor);
  }
}

// Toggle the menu in index.html
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.toggle("open");
  }
}
