import * as THREE from "three";
import * as CANNON from 'cannon-es';
import * as Entities from "./entities.js";
import * as Objects from "./objects.js";

let Scene, World, Camera, Renderer, Player;

function Init(playerPhysicalObj) {
  Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  Renderer.shadowMap.enabled = true;
  Renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(Renderer.domElement);

  Scene = new THREE.Scene();

  World = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.8, 0) });
  World.defaultContactMaterial.friction = 0.25;
  World.broadphase = new CANNON.SAPBroadphase(World);
  World.solver.iterations = 10;
  World.solver.tolerance = 0.001;

  Entities.SetContext(Scene, World);
  Camera = Objects.Camera();
  const physicalObj = new Objects.PPill({
    radius: 0.25,
    mass: 70,
    height: 1.75,
    offsetPos: [0, 0.875, 0],
    fixedRotation: true,
    linearDamping: 0,
    angularDamping: 0
  });
  Camera.position.y = 1.65;
  Player = new Entities.Entity(Objects.VGroup({ children: [Camera] }), physicalObj, { isPlayer: true });
  Entities.Add(Player);

  return { Scene, Player, Renderer, Camera, World };
}

function UpdatePhysics(delta) {
  World.step(delta);
  Entities.Update();
}

function Render() {
  Renderer.render(Scene, Camera);
}

export { Init, UpdatePhysics, Render };
