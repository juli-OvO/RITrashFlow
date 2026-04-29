import * as THREE from "https://unpkg.com/three@0.165.0/build/three.module.js";

export function applyHighlightState(mesh, isActive, time) {
  if (!mesh) {
    return;
  }

  const targetScale = isActive ? 1.04 : 1;
  mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

  if (mesh.material && "emissiveIntensity" in mesh.material) {
    mesh.material.emissive = new THREE.Color("#8fa3b5");
    mesh.material.emissiveIntensity = THREE.MathUtils.lerp(
      mesh.material.emissiveIntensity || 0,
      isActive ? 0.08 + Math.sin(time * 1.4) * 0.01 : 0,
      0.08,
    );
  }
}
