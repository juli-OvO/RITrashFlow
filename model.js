import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.165.0/examples/jsm/loaders/GLTFLoader.js";

export function createCubePlaceholder() {
  const geometry = new THREE.BoxGeometry(2.35, 2.35, 2.35, 1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "#d6dce2",
    roughness: 0.88,
    metalness: 0.04,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = false;
  cube.receiveShadow = false;
  return cube;
}

export function loadTagGLB(url = "./textag.glb") {
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
          if (child.isMesh) {
            console.log("Tag mesh found:", child.name || "(unnamed)");
          }
        });
        resolve(model);
      },
      undefined,
      reject,
    );
  });
}

let _tagCanvas = null;
let _tagTexture = null;
let _tagFaceMesh = null;

export function updateTagTexture(tagModel, text) {
  if (!_tagCanvas) {
    _tagCanvas = document.createElement("canvas");
    _tagCanvas.width = 280;
    _tagCanvas.height = 400;
  }

  if (!_tagFaceMesh) {
    tagModel.traverse((child) => {
      if (child.isMesh && !_tagFaceMesh) _tagFaceMesh = child;
    });
  }

  if (!_tagFaceMesh) return;

  const ctx = _tagCanvas.getContext("2d");
  ctx.clearRect(0, 0, 280, 400);

  ctx.fillStyle = "#f0ece6";
  ctx.fillRect(0, 0, 280, 400);

  ctx.fillStyle = "#1a1f24";
  ctx.font = '500 28px "IBM Plex Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 140, 200);

  if (!_tagTexture) {
    _tagTexture = new THREE.CanvasTexture(_tagCanvas);
    _tagFaceMesh.material = new THREE.MeshStandardMaterial({
      map: _tagTexture,
      roughness: 0.96,
      metalness: 0.02,
    });
  } else {
    _tagTexture.needsUpdate = true;
  }
}
