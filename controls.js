const keys = {};
const mouse = {
  captured: false,
  deltaX: 0,
  deltaY: 0,
  pitch: 0,
  yaw: 0,
  computeDeltas(scale) {
    const deltas = {
      x: this.deltaX * scale,
      y: this.deltaY * scale
    };
    this.deltaX = 0;
    this.deltaY = 0;
    return deltas;
  }
}

const maxSpeed = 7;
document.addEventListener("keydown", (evt) => keys[evt.key] = true );
document.addEventListener("keyup", (evt) => {
  keys[evt.key] = false;
});
document.addEventListener("click", (evt) => document.querySelector("canvas").requestPointerLock() );
document.addEventListener("mousemove", (evt) => {
  if (!document.pointerLockElement) return;
  mouse.deltaX += evt.movementX;
  mouse.deltaY += evt.movementY;
});

function HandleInput(Player, Camera) {
  const speed = 350;
  const jumpSpeed = 1000;
  const rotSpeed = 0.002;
  
  // screw this. new plan:
  // - if player is below max speed, apply a small amount of force in the desired direction
  // - as player approaches max speed, reduce the applied force proportionally
  // - allow player to apply impulse by "dashing" (shift keydown)
  // players should be able to stick to walls, then - make sure they slide slightly, though



  if (keys[" "]) Player.PhysicalObj.applyForce({ x: 0, y: keys.Shift ? -jumpSpeed : jumpSpeed, z: 0 });
  
  const deltas = mouse.computeDeltas(rotSpeed);
  mouse.yaw -= deltas.x;
  mouse.pitch -= deltas.y;

  mouse.pitch = Math.max(
    -Math.PI / 2,
    Math.min(Math.PI / 2, mouse.pitch)
  );

  Camera.quaternion.setFromEuler(
    new THREE.Euler(mouse.pitch, mouse.yaw, 0, "YXZ")
  );
}

export { HandleInput };
