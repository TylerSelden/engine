import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import * as CANNON from "cannon-es";

const Loader = new GLTFLoader();

class Manager {
  constructor(elemId = "loading") {
    this.loaded = {};
    this.total = {};
    this.models = {};
    this.loadData = {};
    this.percentage = 0;

    this.elem = document.getElementById(elemId);
    this.elem.classList.remove("d-none");

    this.tick();
  }
  logStatus = (path, l, t) => {
    this.total[path] = t;
    this.loaded[path] = l;
  }
  register = (path, { parent = null, scale = 1, pos = [0, 0, 0], quat = [0, 0, 0, 1] } = {}) => {
    this.models[path] = [];
    this.loadData[path] = { parent, scale, pos, quat };
  }
  load = (cb) => {
    this.cb = cb;
    for (const [path, data] of Object.entries(this.loadData)) {
      const { parent, scale, pos, quat } = data;
      Loader.load(path, (model) => {
        model.scene.scale.set(scale, scale, scale);
        model.scene.position.set(...pos);
        model.scene.quaternion.set(...quat);

        const physicalObj = model.scene.userData.physics ? new CANNON.Body(model.scene.userData.physics) : null;
        if (model.scene.userData.physics) {
          model.scene.traverse((child) => {

            if (child.isMesh && child.userData.physicalObj) {
              const pos = child.getWorldPosition(new THREE.Vector3());
              const quat = child.getWorldQuaternion(new THREE.Quaternion());
              child.visible = false;

              if (child.userData.name === "Box") {
                const scale = Object.values(child.scale).map(val => val / 2);
                physicalObj.addShape(new CANNON.Box(new CANNON.Vec3(...scale)), pos, quat);
              } else if (child.userData.name === "Sphere") {
                physicalObj.addShape(new CANNON.Sphere(child.scale.x), pos, quat); 
              } else if (child.userData.name === "Cylinder") {
                physicalObj.addShape(new CANNON.Cylinder(child.scale.x, child.scale.x, child.scale.y, 16), pos, quat);
              }
            }
          });
        }
        
        if (parent) parent.add(model.scene);
        this.submit(path, [model.scene, physicalObj]);
      }, (xhr) => {
        this.logStatus(path, xhr.loaded, xhr.total);
      }, (err) => {
        throw new Error(err);
      });
    }
  }
  submit = (path, obj) => {
    this.models[path] = obj;
    if (Object.values(this.models).every(v => v.length > 0)) {
      if (this.elem) this.elem.classList.add("d-none");
      if (this.cb) this.cb();
    }
  }
  tick = () => {
    let l = Object.values(this.loaded).reduce((a, b) => a + b, 0);
    let t = Object.values(this.total).reduce((a, b) => a + b, 0);
    this.percentage = l / t * 100 || 0;

    if (this.elem) this.elem.innerText = `Loading (${this.percentage.toFixed(2)}%)`;

    if (this.percentage !== 100) {
      requestAnimationFrame(this.tick);
    } else {
      if (this.elem) this.elem.innerText = "Processing...";
    }
  }
}

export { Manager };
