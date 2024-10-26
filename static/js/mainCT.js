import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////new code /////////////////////////////////////////////////////////////////////////////////////

// Model Configuration based on car type passed via URL (from indexCT.html)
const urlParams = new URLSearchParams(window.location.search);
const carType = urlParams.get("model") || "cybertruck";

// Assuming `carType` holds the predicted model like 'cybertruck', 'model-s', etc.
const priceGifElement = document.getElementById("priceGif");
const warrantyGifElement = document.getElementById("warrentyGif");

// Update the src attributes to point to the respective GIFs based on the model
priceGifElement.src = `/static/images/${carType}/price.gif`;
warrantyGifElement.src = `/static/images/${carType}/warrenty.gif`;

// Use the dynamic modelUrl passed from indexCT.html
const carConfigs = {
  cybertruck: {
    path: modelUrl, // modelUrl is defined in indexCT.html
    scale: [3, 3, 3],
    cameraPosition: [0, 5, 55],
    controls: {
      minPolarAngle: Math.PI / 2.2,
      maxPolarAngle: Math.PI / 2.2,
      minDistance: 40,
      maxDistance: 80,
    },
  },
  // Repeat similar structure for other models (model-s, model-3, etc.)
  "model-s": {
    path: modelUrl,
    scale: [3, 3, 3],
    cameraPosition: [0, 5, 10],
    controls: {
      minPolarAngle: Math.PI / 2.5,
      maxPolarAngle: Math.PI / 2.5,
      minDistance: 10,
      maxDistance: 50,
    },
  },
  "model-3": {
    path: modelUrl,
    scale: [1, 1, 1],
    cameraPosition: [0, 10, 440],
    controls: {
      minPolarAngle: Math.PI / 2.2,
      maxPolarAngle: Math.PI / 2.2,
      minDistance: 440,
      maxDistance: 480,
    },
  },
  "model-x": {
    path: modelUrl,
    scale: [2, 2, 2],
    cameraPosition: [0, 5, 6],
    controls: {
      minPolarAngle: Math.PI / 2.5,
      maxPolarAngle: Math.PI / 2.5,
      minDistance: 6,
      maxDistance: 90,
    },
  },
  "model-y": {
    path: modelUrl,
    scale: [2, 2, 2],
    cameraPosition: [0, 5, 7],
    controls: {
      minPolarAngle: Math.PI / 2.4,
      maxPolarAngle: Math.PI / 2.4,
      minDistance: 7,
      maxDistance: 80,
    },
  },
};

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const container3D = document.getElementById("container3D");
renderer.setSize(container3D.offsetWidth, container3D.offsetHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container3D.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 5).normalize();
scene.add(directionalLight);

// Function to Load 3D Model Based on Car Type
function loadCarModel(carType) {
  const config = carConfigs[carType];
  const gltfLoader = new GLTFLoader();
  let carModel;

  // Load the specific car model using the path from the HTML
  gltfLoader.load(
    config.path,
    function (gltf) {
      carModel = gltf.scene;
      carModel.scale.set(...config.scale);
      scene.add(carModel);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error("An error occurred while loading the model:", error);
    }
  );

  // Update camera and controls
  camera.position.set(...config.cameraPosition);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = config.controls.minPolarAngle;
  controls.maxPolarAngle = config.controls.maxPolarAngle;
  controls.minDistance = config.controls.minDistance;
  controls.maxDistance = config.controls.maxDistance;
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  window.addEventListener("resize", function () {
    const container3D = document.getElementById("container3D");
    camera.aspect = container3D.offsetWidth / container3D.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container3D.offsetWidth, container3D.offsetHeight); // Resize based on container
  });

  window.addEventListener(
    "wheel",
    function (event) {
      event.preventDefault();
    },
    { passive: false }
  );

  function animate() {
    requestAnimationFrame(animate);
    if (carModel) {
      carModel.rotation.y += 0.01; // Rotate the car model slowly
    }
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// Call this function to load the model based on the carType
loadCarModel(carType);

// Bar Chart: Top Speed of Tesla Models
const ctx1 = document.getElementById("topSpeedChart").getContext("2d");
const topSpeedData = {
  labels: ["Cybertruck", "Model S", "Model 3", "Model X", "Model Y"],
  datasets: [
    {
      label: "Top Speed (Km/h)",
      data: [210, 322, 262, 262, 250],
      backgroundColor: [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
      ],
      borderWidth: 1,
    },
  ],
};
const font30 = 12;
const topSpeedChart = new Chart(ctx1, {
  type: "bar",
  data: topSpeedData,
  options: {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
          font: { size: font30 }, // Increase font size for Y-axis labels
        },
        title: { display: true, text: "Speed (Km/h)", font: { size: font30 } }, // Y-axis title font
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
      x: {
        ticks: { font: { size: font30 } }, // Increase font size for X-axis labels
        title: { display: true, text: "Tesla Models", font: { size: font30 } }, // X-axis title font
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
    },
    plugins: { legend: { display: false } },
  },
});

// Line Chart: Battery Range in Miles
const ctx2 = document.getElementById("batteryRangeChart").getContext("2d");

// Multi-line chart for Tesla models' mileage including Cybertruck and Model Y
const ctxMiles = document.getElementById("batteryRangeChart").getContext("2d");
const milesChart = new Chart(ctxMiles, {
  type: "line",
  data: {
    labels: ["20%", "40%", "60%", "80%", "100%"],
    datasets: [
      {
        label: "Cybertruck",
        data: [110, 220, 330, 440, 550],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Model S",
        data: [81, 162, 243, 324, 405],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Model 3",
        data: [122.8, 245.6, 368.4, 491.2, 614], // Data for Model 3
        borderColor: "rgba(255, 159, 64, 1)", // Orange color
        backgroundColor: "rgba(255, 159, 64, 0.2)", // Light orange for fill
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Model X",
        data: [116, 232, 348, 464, 580], // Data for Model X
        borderColor: "rgba(75, 192, 192, 1)", // Green color
        backgroundColor: "rgba(75, 192, 192, 0.2)", // Light green for fill
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Model Y",
        data: [108.4, 216.8, 325.2, 433.6, 542], // Data for Model Y
        borderColor: "rgba(153, 102, 255, 1)", // Purple color
        backgroundColor: "rgba(153, 102, 255, 0.2)", // Light purple for fill
        borderWidth: 2,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { font30 }, // Increase Y-axis font
        },
        title: {
          display: true,
          text: "Kilometers",
          font: { font30 }, // Increase Y-axis title font
        },
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
      x: {
        ticks: {
          font: { font30 }, // Increase X-axis font
        },
        title: {
          display: true,
          text: "Battery Charge",
          font: { font30 }, // Increase X-axis title font
        },
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: { font30 }, // Increase font size for legend labels
        },
      },
    },
  },
});

// Radar Chart: Scaled Acceleration, Battery Capacity, and Price of Tesla Models
const ctx3 = document.getElementById("efficiencyChart").getContext("2d");

const scaledEfficiencyData = {
  labels: ["Acceleration (Scaled)", "Battery Capacity (kWh)", "Price ($k)"],
  datasets: [
    {
      label: "Cybertruck",
      data: [300, 246, 276], // Scaled acceleration for Cybertruck
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 2,
    },
    {
      label: "Model S",
      data: [310, 200, 208], // Scaled acceleration for Model S
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2,
    },
    {
      label: "Model 3",
      data: [440, 164, 102], // Scaled acceleration for Model 3
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      borderColor: "rgba(255, 206, 86, 1)",
      borderWidth: 2,
    },
    {
      label: "Model X",
      data: [380, 200, 222], // Scaled acceleration for Model X
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 2,
    },
    {
      label: "Model Y",
      data: [350, 164, 102], // Scaled acceleration for Model Y
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255, 1)",
      borderWidth: 2,
    },
  ],
};

const scaledEfficiencyChart = new Chart(ctx3, {
  type: "radar",
  data: scaledEfficiencyData,
  options: {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 250,
        ticks: {
          font: { size: font30 }, // Increase font size for radial scale (ticks)
        },
        pointLabels: {
          font: {
            size: font30, // Increase font size for radar labels (e.g., Acceleration, Battery Capacity)
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: { size: 7 }, // Increase font size for legend
        },
      },
    },
  },
});

// Bubble Chart: Sales data for Tesla Models
const ctx4 = document.getElementById("salesChart").getContext("2d");

const salesData = {
  datasets: [
    {
      label: "Cybertruck",
      data: [{ x: 2022, y: 4.5, r: 30 }], // Example data
      backgroundColor: "rgba(255, 99, 132, 0.7)",
      borderColor: "rgba(255, 99, 132, 1)",
    },
    {
      label: "Model S",
      data: [{ x: 2012, y: 4.7, r: 50 }], // Example data
      backgroundColor: "rgba(54, 162, 235, 0.7)",
      borderColor: "rgba(54, 162, 235, 1)",
    },
    {
      label: "Model 3",
      data: [{ x: 2017, y: 4.8, r: 70 }], // Example data
      backgroundColor: "rgba(255, 206, 86, 0.7)",
      borderColor: "rgba(255, 206, 86, 1)",
    },
    {
      label: "Model X",
      data: [{ x: 2015, y: 4.6, r: 40 }], // Example data
      backgroundColor: "rgba(75, 192, 192, 0.7)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
    {
      label: "Model Y",
      data: [{ x: 2020, y: 4.7, r: 60 }], // Example data
      backgroundColor: "rgba(153, 102, 255, 0.7)",
      borderColor: "rgba(153, 102, 255, 1)",
    },
  ],
};

const salesChart = new Chart(ctx4, {
  type: "bubble",
  data: salesData,
  options: {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: { size: font30 }, // Increase X-axis font size
        },
        title: {
          display: true,
          text: "Year of Release",
          font: { size: font30 }, // Increase X-axis title font
        },
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
      y: {
        ticks: {
          font: { size: font30 }, // Increase Y-axis font size
        },
        title: {
          display: true,
          text: "Average Review Score (out of 5)",
          font: { size: font30 }, // Increase Y-axis title font
        },
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: { size: font30 }, // Increase legend font size
        },
      },
    },
  },
});

// HP Line Graph
const ctxHp = document.getElementById("chartHpGraph").getContext("2d");
const hpChart = new Chart(ctxHp, {
  type: "line",
  data: {
    labels: ["Cybertruck", "Model S", "Model 3", "Model X", "Model Y"],
    datasets: [
      {
        label: "Horsepower (HP)",
        data: [1000, 1020, 480, 1020, 530],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true, // Make the chart responsive
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: font30 } }, // Increase Y-axis font size
        title: {
          display: true,
          text: "Horsepower (HP)",
          font: { size: font30 },
        }, // Increase Y-axis title font
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
      x: {
        ticks: { font: { size: font30 } }, // Increase X-axis font size
        title: { display: true, text: "Tesla Models", font: { size: font30 } }, // Increase X-axis title font
        grid: {
          display: false, // Remove grid lines on the Y-axis
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: { size: font30 }, // Increase legend font size
        },
      },
    },
  },
});

const modelName = modelUrl.split("/").slice(-2, -1)[0];
// Define acceleration times for each Tesla model (in seconds)
const accelerationTimes = {
  cybertruck: 2.9,
  "model-s": 1.99,
  "model-3": 3.1,
  "model-x": 2.5,
  "model-y": 3.5,
};

// Get the acceleration time for the predicted car model
const accelerationTime = accelerationTimes[carType] || 2.9; // Default to Cybertruck if no match

// Create a JustGage chart for the 0-60 mph speed range
const gauge = new JustGage({
  id: "gaugeChartContainer", // The id of the container where the gauge will be placed
  value: 0, // Start value for the animation
  min: 0, // Minimum value of the gauge (0 mph)
  max: 60, // Maximum value (60 mph for 0-60 acceleration)
  title: "0-60 MPH Acceleration",
  label: `Speed (mph)\n in ${accelerationTime} seconds \n${modelName}`, // Update the label with the predicted model's acceleration time
  gaugeWidthScale: 0.6,
  relativeGaugeSize: true,
  pointer: true, // Show the pointer in the gauge
  levelColors: ["#00ff00", "#ff9900", "#ff0000"], // Color transition from green to red
  startAnimationTime: 0, // Disable the default animation time (we'll control it manually)
});

// Function to animate the gauge from 0 to 60 mph
function animateGaugeToSpeed() {
  const targetSpeed = 60; // Final speed (60 mph)
  let currentSpeed = 0; // Start at 0
  const step = targetSpeed / (accelerationTime * 100); // Calculate the step to increment every 10ms

  const interval = setInterval(() => {
    currentSpeed += step;
    gauge.refresh(currentSpeed); // Refresh the gauge with the updated speed

    if (currentSpeed >= targetSpeed) {
      clearInterval(interval); // Stop when the target speed is reached
    }
  }, 10); // Update the gauge every 10 milliseconds
}

// Start the gauge animation when the page loads, with dynamic time based on predicted car model
setTimeout(() => {
  animateGaugeToSpeed();
}, 100); // Slight delay to start the animation
