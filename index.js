import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.135.0/examples/jsm/loaders/OBJLoader.js';

// Setting Renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// 🎥 Setting Camera
const fov = 75;           // Field of View
const aspect = w / h;     // Aspect Ratio
const far = 1000;           // Farrest range that renders
const near = 0.1;         // Nearest range that renders
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.x = 70;
camera.position.y = 70;
camera.position.z = 70;

// 🎬 Setting Scene
const scene = new THREE.Scene();
// Set the scene background color
let gridHelper; // Declare gridHelper globally

// Define Controllers
const controls = new OrbitControls(camera, renderer.domElement);

// Addaptive Resizing
// Create a function to handle window resizing
function handleWindowResize() {
  // Update the size of the renderer to the new window dimensions
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);

  // Update the camera aspect ratio to match the new window size
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

// Add an event listener to handle window resizing
window.addEventListener('resize', handleWindowResize, false);

// Initial call to set up the renderer and camera aspect ratio
handleWindowResize();

// ⚪️ Load 3D model
const loader = new OBJLoader();
loader.load('models/TopOptimized.obj', (object) => {
  // Add the object to the scene
  scene.add(object);

  // Ensure the environment map is loaded before applying materials
  const envMap = new THREE.CubeTextureLoader().load([
    'path/to/px.jpg', // Positive X
    'path/to/nx.jpg', // Negative X
    'path/to/py.jpg', // Positive Y
    'path/to/ny.jpg', // Negative Y
    'path/to/pz.jpg', // Positive Z
    'path/to/nz.jpg', // Negative Z
  ]);
  
  // Create a metal material
  const metalMaterial = new THREE.MeshPhysicalMaterial({
    color:0xe0d7c1, // Gold color
    metalness: 0.9,  // Full metal
    roughness: 0.3,  // Slightly polished
    envMap: envMap,  // Add reflections
    envMapIntensity: 1.0, // Control reflection intensity
    clearcoat: 0.5,  // Add clearcoat for realism (optional)
    clearcoatRoughness: 0.1, // Clearcoat smoothness
  });

  // Traverse through the object and apply the material to all meshes
  object.traverse((child) => {
    if (child.isMesh) {
      child.material = metalMaterial; // Apply the metal material to each mesh
    }
  });
});

// Add Axes Helper to the scene
const axesHelper = new THREE.AxesHelper(50) // Size of the axes
scene.add(axesHelper);
axesHelper.position.y += 0.03

// 💡 Adding Light
const hemilight = new THREE.HemisphereLight(0xffffff, 0x000000)
scene.add(hemilight) // Add to scene

const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(5, 10, 7.5);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(-5, -10, 2);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


//////////////////////////////////////
// Function to set light/dark mode
function setMode(mode) {
  if (mode === "dark") {
    // Apply dark background and text color
    document.body.style.backgroundColor = "#2c2c2c";  // Dark background
    document.body.style.color = "#ffffff";  // Light text color for dark mode
    scene.background = new THREE.Color(0x2c2c2c);  // Scene background

    if (gridHelper) scene.remove(gridHelper);
    gridHelper = new THREE.GridHelper(100, 30, 0x474747, 0x474747);
    scene.add(gridHelper);
  } else {
    // Apply light background and text color
    document.body.style.backgroundColor = "#ebebeb";  // Light background
    document.body.style.color = "#000000";  // Dark text color for light mode
    scene.background = new THREE.Color(0xebebeb);  // Scene background

    if (gridHelper) scene.remove(gridHelper);
    gridHelper = new THREE.GridHelper(100, 30, 0xb7b7b7, 0xcbcbcb);
    scene.add(gridHelper);
  }
}
// Toggle Mode Button
const toggleButton = document.createElement("button");
toggleButton.innerText = "Dark/Light Mode";
toggleButton.style.position = "absolute";
toggleButton.style.top = "10px";
toggleButton.style.left = "10px";
document.body.appendChild(toggleButton);

let currentMode = "light"; // Default mode

// Detect system dark mode and set mode accordingly
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  setMode("dark");
  currentMode = "dark"; // Update default to dark mode
  toggleButton.innerHTML = `<i class="fas fa-moon"></i>`; // Update the button icon
} else {
  setMode("light");
  currentMode = "light"; // Default to light mode
  toggleButton.innerHTML = `<i class="fas fa-sun"></i>`; // Update the button icon
}

// Ensure that the setMode function is also invoked when the button is clicked
toggleButton.addEventListener("click", () => {
  currentMode = currentMode === "light" ? "dark" : "light";  // Toggle mode
  setMode(currentMode);

  // Toggle the icon on the button
  if (currentMode === "light") {
    toggleButton.innerHTML = `<i class="fas fa-sun"></i>`;
  } else {
    toggleButton.innerHTML = `<i class="fas fa-moon"></i>`;
  }
});

//////////////////////////////////////

// ⚡️ Rendering the Scene
renderer.render(scene, camera);

// Animate
function animate() {
    requestAnimationFrame(animate); // Call the function again for the next frame
  
    // Optionally add object rotations here
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
    // mesh.rotation.z += 0.01;
  
    renderer.render(scene, camera); // Render the scene with the camera
}
  
animate(); // Start the animation loop
