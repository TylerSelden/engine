import * as CANNON from "cannon-es";
import * as Loader from "./engine/plugins/loader.js";
import * as Objects from "./objects.js";
import * as Entities from "./engine/entities.js";

const pairs = [];
let Scene, Manager;

export async function loadAssets(scene) {
  Scene = scene;

  Manager = new Loader.Manager();
  Manager.register("./assets/stadium.glb");
  Manager.register("./assets/skybox.glb");
  Manager.register("./assets/thing.glb", { pos: [0, 2, -3] });
  Manager.register("./assets/apple.glb", { pos: [0, 4, -3] });
  Manager.register("./assets/ball.glb");

  await Manager.load();

  const ground = Objects.PPlane({ mass: 0 });
  ground.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    -Math.PI / 2
  );
  Entities.Add(new Entities.Entity(null, ground, { quat: Object.values(ground.quaternion) }));

  Entities.Add(Manager.models["./assets/skybox.glb"]);
  Entities.Add(Manager.models["./assets/stadium.glb"]);
  Entities.Add(Manager.models["./assets/thing.glb"]);
  Entities.Add(Manager.models["./assets/apple.glb"]);
//  Entities.Add(Manager.models["./assets/ball.glb"]);

  Objects.AmbientLight({ parent: Scene, intensity: 1, color: 0x5A2E8A });
  Objects.AmbientLight({ parent: Scene, intensity: 2, color: 0xFFFFFF });
}
