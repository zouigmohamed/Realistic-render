import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";


// Loaders
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

// Debug
const gui = new GUI();
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

// Update all materials
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh) {
      // You have used: if (child.isMesh && child.material.isMeshStandardMaterial)
      // I modified it to be: if (child.isMesh) { // Removed isMeshStandardMaterial check for more generality
      child.castShadow = true; // You have used: child.castShadow = true;
      child.receiveShadow = true; // You have used: child.receiveShadow = true;
    }
  });
};

// Environment map
scene.environmentIntensity = 1;
gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001);

rgbeLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;

  updateAllMaterials(); // You have missed calling this after the environment map is loaded
});

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(-4, 6.5, 2.5);
directionalLight.scale.set(2, 2, 2);
scene.add(directionalLight);

// Added shadow settings for debugging and more realistic lighting
directionalLight.castShadow = true; // You have used: directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.5; // I modified it to be: directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 15; // I modified it to be: directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -10; // I modified it to be: directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10; // I modified it to be: directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10; // I modified it to be: directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10; // I modified it to be: directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.mapSize.set(1024, 1024); // I modified it to be: directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.027;
directionalLight.shadow.bias = -0.004;
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Directional Light Intensity");
gui
  .add(directionalLight.position, "x")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("Directional Light X");
gui
  .add(directionalLight.position, "y")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("Directional Light Y");
gui
  .add(directionalLight.position, "z")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("Directional Light Z");
  gui.add(directionalLight.shadow, "normalBias").min(-0.05).max(0.05).step(0.0001).name("Normal Bias");
  gui.add(directionalLight.shadow , "bias").min(-0.05).max(0.05).step(0.0001).name("Bias");

// Added helper for debugging shadows
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5
);

// You have used: // const directionalLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// I modified it to be: const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5); // Simplified for direction light helper
// scene.add(directionalLightHelper);

// Added shadow camera helper for debugging the camera's frustum bounds
const shadowCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// scene.add(shadowCameraHelper);

// Load model
// gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
//   gltf.scene.scale.set(10, 10, 10);
//   scene.add(gltf.scene);

//   updateAllMaterials(); // You have used: updateAllMaterials(); here as well, which is correct!
// });
let hamburger;
gltfLoader.load("/models/hamburger.glb", (gltf) => {
    hamburger = gltf.scene;

  hamburger.scale.set(0.4, 0.4, 0.4);
  hamburger.position.set(0, 2.5, 0);
  scene.add(hamburger);

  updateAllMaterials();
});

//floor
const floorColorTexture = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg"
);
const floorNormalTexture = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png"
);
const floorAORoughnessMetalnessTexture = textureLoader.load(
  "/textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg"
);
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    normalMap: floorNormalTexture,
    aoMap: floorAORoughnessMetalnessTexture,
    roughnessMap: floorAORoughnessMetalnessTexture,
    metalnessMap: floorAORoughnessMetalnessTexture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);
/**
 * Wall
 */
const wallColorTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg')
const wallNormalTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png')
const wallAORoughnessMetalnessTexture = textureLoader.load('/textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg')

const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        normalMap: wallNormalTexture,
        aoMap: wallAORoughnessMetalnessTexture,
        roughnessMap: wallAORoughnessMetalnessTexture,
        metalnessMap: wallAORoughnessMetalnessTexture,
    })
)
wall.position.y = 4
wall.position.z = - 4
scene.add(wall)
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

wallColorTexture.colorSpace = THREE.SRGBColorSpace;
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.antialias = true;
gui.add(renderer, "antialias").name("Antialias");

// Updated tone mapping for physically correct lighting
renderer.toneMapping = THREE.ReinhardToneMapping; // You have used: renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
gui
  .add(renderer, "toneMappingExposure")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Tone Mapping Exposure");

gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials(); // You have used: updateAllMaterials(); here as well, which is correct!
  });

renderer.physicallyCorrectLights = true; // You have used: renderer.physicallyCorrectLights = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // You have used: renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = true;

// Clock
const clock = new THREE.Clock();
// Animate
const tick = () => {
    //animate hamburger
    const elapsedTime = clock.getElapsedTime()
    if(hamburger){
        hamburger.rotation.y = elapsedTime * 0.1
        hamburger.rotation.x = Math.sin(elapsedTime * 0.4)
        hamburger.rotation.z = Math.cos(elapsedTime * 0.4)
    }
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
