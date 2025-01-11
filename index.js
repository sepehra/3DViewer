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
scene.background = new THREE.Color(0x111111);

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
loader.load('models/vertices.obj', (object) => {
  // Add the object to the scene
  scene.add(object);

  // 1. Access the geometry of the loaded object
  const geometry = object.children[0].geometry;

  // 2. Create a material for points (vertices)
  const material = new THREE.PointsMaterial({
    color: 0xFFFFFF,   // Green color for the vertices
    size: 0.5,         // Size of the points (vertices)
    transparent: true, // Make points slightly transparent
    opacity: 1,        // Full opacity
  });

  // 3. Create the points object and add to the scene
  const points = new THREE.Points(geometry, material);
  scene.add(points);
});

//Grids
const gridHelper = new THREE.GridHelper(100, 30 ,0x747474 ,0x313131); // Grid size 100 and 20 divisions
scene.add(gridHelper);

/*
// ⚪️ Adding an object to the scene (a green cube)
const geometry = new THREE.IcosahedronGeometry(1, 10);
const material = new THREE.MeshStandardMaterial(
    {
        color: 0x00ff00,
        flatShading: true
    });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh); // Add to scene
*/

// 💡 Adding Light
const hemilight = new THREE.HemisphereLight(0xffffff, 0x000000)
scene.add(hemilight) // Add to scene

// ⚡️ Rendering the Scene
renderer.render(scene, camera);

// Animate
function animate() {
    requestAnimationFrame(animate); // Call the function again for the next frame
  
    // Optionally add object rotations here
    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;
  
    renderer.render(scene, camera); // Render the scene with the camera
}
  
animate(); // Start the animation loop
