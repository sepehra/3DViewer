import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Setting Renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// 🎥 Setting Camera
const fov = 75;           // Field of View
const aspect = w / h;     // Aspect Ratio
const far = 10;           // Farrest range that renders
const near = 0.1;         // Nearest range that renders
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

// 🎬 Setting Scene
const scene = new THREE.Scene();

// Define Controllers
const controls = new OrbitControls(camera, renderer.domElement);

// ⚪️ Adding an object to the scene (a green cube)
const geometry = new THREE.IcosahedronGeometry(1, 10);
const material = new THREE.MeshStandardMaterial(
    {
        color: 0x00ff00,
        flatShading: true
    });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh); // Add to scene

// 💡 Adding Light
const hemilight = new THREE.HemisphereLight(0xffffff, 0x000000)
scene.add(hemilight) // Add to scene

// ⚡️ Rendering the Scene
renderer.render(scene, camera);
