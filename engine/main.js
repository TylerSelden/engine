import * as THREE from "three";
import * as CANNON from 'cannon-es';
import * as Entities from "./entities.js";

let Scene, World, Camera, Renderer;

function Init(playerPhysicalObj) {
  Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  Renderer.shadowMap.enabled = true;
  Renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(Renderer.domElement);

  Scene = new THREE.Scene();

  World = new CANNON.World();
  World.broadphase = new CANNON.SAPBroadphase(World);
  World.solver.iterations = 10;
  World.solver.tolerance = 0.001;

  Entities.SetContext(Scene, World);
  Camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);


  return { Scene, Renderer, Camera, World };
}

function UpdatePhysics(delta) {
  World.step(delta);
  Entities.Update();
}

function Render() {
  Renderer.render(Scene, Camera);
}

export { Init, UpdatePhysics, Render };
