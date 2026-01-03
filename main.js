import * as THREE from "three";
import * as Engine from "./engine/main.js";
import * as Setup from "./setup.js";

let Scene, Player, Renderer, Camera, World;

window.onload = async () => {
  ({ Scene, Player, Renderer, Camera, World } = Engine.Init());

  Setup.loadAssets(Scene, start);

  // FIXME
  window.THREE = THREE;
  window.Scene = Scene;
  window.Camera = Camera;
  window.World = World;
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
