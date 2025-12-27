import * as THREE from "three";
import * as CANNON from 'cannon-es';
import * as Entities from "./entities.js";
import * as Objects from "./objects.js";

let Scene, World, Camera, Renderer, Player;

function Init() {
  Renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  Renderer.shadowMap.enabled = true;
  Renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(Renderer.domElement);

  Scene = new THREE.Scene();

  World = new CANNON.World({ gravity: new CANNON.Vec3(0, -4, 0) });
  World.broadphase = new CANNON.SAPBroadphase(World);
  World.solver.iterations = 10;
  World.solver.tolerance = 0.001;

  // FIXME: this shouldn't be added by the engine
  const ground = new CANNON.Body({
    mass: 0,
    shape: new CANNON.Plane()
  });
  ground.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    -Math.PI / 2
  );
  World.addBody(ground);

  Entities.SetContext(Scene, World);
  Camera = Objects.Camera();
  const physicalObj = new Objects.PPill({
    radius: 0.25,
    mass: 70,
    height: 1.75,
    offsetPos: [0, 0.875, 0],
    fixedRotation: true
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
