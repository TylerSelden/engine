import * as THREE from "three";
import * as Engine from "./engine/main.js";
import * as Entities from "./engine/entities.js";
import * as Setup from "./setup.js";
import * as Objects from "./objects.js";

let Scene, Player, Renderer, Camera, World;

window.onload = async () => {
  ({ Scene, Renderer, Camera, World } = Engine.Init());
  
  const playerGroup = new THREE.Group();
  playerGroup.add(Camera);
  Player = new Entities.Entity(playerGroup, Objects.PPill({
    radius: 0.25,
    mass: 70,
    height: 1.75,
    offsetPos: [0, 0.875, 0],
    fixedRotation: true,
    linearDamping: 0,
    angularDamping: 0
  }));
  World.gravity.y = -9.81;
  Camera.position.y = 1.65;
  Entities.Add(Player);

  Setup.loadAssets(Scene, start);

  window.Scene = Scene;
  window.Player = Player;
  window.Renderer = Renderer;
  window.Camera = Camera;
  window.World = World;
  window.Entities = Entities;
};

const Clock = new THREE.Clock();
function start() {
  renderLoop();
  setInterval(logicLoop, 1000 / 60);
}
function renderLoop() {
  Engine.Render(Clock.getDelta());
  requestAnimationFrame(renderLoop);
}

function logicLoop() {
  Engine.UpdatePhysics(1 / 60);
}
