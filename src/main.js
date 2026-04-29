import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";
import { createCubePlaceholder, loadTagGLB, updateTagTexture } from "./model.js";
import { getScenes } from "./scrollScenes.js";
import { createUiPanel } from "./uiPanel.js";
import { applyHighlightState } from "./highlights.js";
import * as animState from "./animState.js";
import { createScrollController } from "./scrollController.js";

const canvas = document.getElementById("webgl-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#f5f3ef");

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 12);

const ambientLight = new THREE.AmbientLight("#ffffff", 1.8);
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.1);
directionalLight.position.set(4, 6, 8);
const fillLight = new THREE.DirectionalLight("#d6dce2", 0.6);
fillLight.position.set(-6, -2, 6);
scene.add(ambientLight, directionalLight, fillLight);

const cube = createCubePlaceholder();
scene.add(cube);
const cubeBaseScale = 1.55;
cube.scale.setScalar(cubeBaseScale);

let tag = null;

const sections = [...document.querySelectorAll(".scroll-section")];
let isMobile = window.innerWidth <= 820;
let scenes = getScenes(isMobile);

const ui = createUiPanel();
let scrollCtrl = null;

animState.onTransition((newIndex) => {
  ui.update(scenes[newIndex]);
  if (tag) updateTagTexture(tag, scenes[newIndex].tagLabel);
});

function updateResponsiveSceneSet() {
  isMobile = window.innerWidth <= 820;
  scenes = getScenes(isMobile);
  camera.fov = isMobile ? 44 : 35;
  camera.position.z = isMobile ? 14 : 12;
  camera.updateProjectionMatrix();
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  camera.aspect = window.innerWidth / window.innerHeight;
  updateResponsiveSceneSet();
  if (scrollCtrl) scrollCtrl.snapTo(animState.activeIndex);
}

window.addEventListener("resize", onResize);

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

const clock = new THREE.Clock();

function animate() {
  const dt = Math.min(clock.getDelta(), 0.1);
  const elapsed = clock.elapsedTime;

  const lf = (base) => 1 - Math.pow(base, dt * 60);

  const activeScene = scenes[animState.activeIndex];

  // Cube
  const cubeTarget = new THREE.Vector3(
    activeScene.cubeTargetPosition.x,
    activeScene.cubeTargetPosition.y,
    activeScene.cubeTargetPosition.z,
  );
  cube.position.lerp(cubeTarget, lf(0.08));

  const cubeIdleX = Math.sin(elapsed * 0.7) * 0.08;
  const cubeIdleY = Math.sin(elapsed * 1.1) * 0.12;
  cube.rotation.x = THREE.MathUtils.lerp(cube.rotation.x, cubeIdleY * 0.15, lf(0.08));
  cube.rotation.y = THREE.MathUtils.lerp(
    cube.rotation.y,
    cubeIdleX * 0.55 + animState.activeIndex * 0.08,
    lf(0.08),
  );
  cube.rotation.z = THREE.MathUtils.lerp(cube.rotation.z, Math.sin(elapsed * 0.45) * 0.03, lf(0.08));
  cube.scale.lerp(new THREE.Vector3(cubeBaseScale, cubeBaseScale, cubeBaseScale), lf(0.08));

  // Tag — drop-settle
  if (tag) {
    const now = performance.now();
    const t = Math.min(
      (now - animState.transitionTime) / animState.TRANSITION_DURATION,
      1,
    );
    const eased = easeOutBack(t);

    if (activeScene.tagVisible) {
      const startY = activeScene.tagTargetPosition.y + 2;
      const targetX = activeScene.tagTargetPosition.x;
      const targetY = activeScene.tagTargetPosition.y;
      const targetZ = activeScene.tagTargetPosition.z;

      tag.position.x = THREE.MathUtils.lerp(tag.position.x, targetX, lf(0.08));
      tag.position.y = THREE.MathUtils.lerp(startY, targetY, eased);
      tag.position.z = THREE.MathUtils.lerp(tag.position.z, targetZ, lf(0.08));

      const restingTilt = THREE.MathUtils.degToRad(activeScene.tagSide === "right" ? 8 : -8);
      tag.rotation.z = THREE.MathUtils.lerp(0, restingTilt, eased);
      tag.rotation.x = THREE.MathUtils.lerp(tag.rotation.x, Math.sin(elapsed * 0.9) * 0.04, lf(0.08));
      tag.rotation.y = THREE.MathUtils.lerp(tag.rotation.y, Math.sin(elapsed * 0.6) * 0.12, lf(0.08));

      const targetOpacity = Math.max(0, Math.min(1, eased));
      tag.traverse((child) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = THREE.MathUtils.lerp(
            child.material.opacity ?? 0,
            targetOpacity,
            lf(0.12),
          );
        }
      });
    } else {
      tag.position.y = THREE.MathUtils.lerp(tag.position.y, -4, lf(0.08));
      tag.traverse((child) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = THREE.MathUtils.lerp(
            child.material.opacity ?? 0,
            0,
            lf(0.12),
          );
        }
      });
    }
  }

  applyHighlightState(cube, animState.activeIndex === 0, elapsed);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

async function init() {
  updateResponsiveSceneSet();

  scrollCtrl = createScrollController(sections.length, (index) => {
    animState.setScene(index);
  });

  ui.updateInstant(scenes[animState.activeIndex]);
  animate();

  try {
    tag = await loadTagGLB();
    scene.add(tag);
    tag.position.set(0, -4, -1);
    tag.traverse((child) => {
      if (child.material) {
        child.material.transparent = true;
        child.material.opacity = 0;
      }
    });
    updateTagTexture(tag, scenes[animState.activeIndex].tagLabel);
  } catch (e) {
    console.warn("textag.glb failed to load:", e);
  }
}

init();
