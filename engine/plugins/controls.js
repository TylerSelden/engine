export const Keyboard = {
  keys: {},
  events: {
    down: {},
    hold: {},
    up: {}
  },
  On(eventType, key, func) {
    if (this.events[eventType]) this.events[eventType][key] = func;
  },
  Remove(eventType, key) {
    if (this.events[eventType] && this.events[eventType][key]) delete this.events[eventType][key];
  },
  update() {
    for (const key in this.keys) {
      if (this.keys[key] && this.events.hold[key]) this.events.hold[key]();
    }
  }
};

window.addEventListener('keydown', (e) => {
  if (!Keyboard.keys[e.key] && Keyboard.events.down[e.key]) Keyboard.events.down[e.key]();
  Keyboard.keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  if (Keyboard.keys[e.key] && Keyboard.events.up[e.key]) Keyboard.events.up[e.key]();
  delete Keyboard.keys[e.key];
});



export const Mouse = {
  isDown: false,
  events: {
    down: null,
    hold: null,
    up: null,
    move: null,
    lockDown: null,
    lockHold: null,
    lockUp: null,
    lockMove: null
  },
  attemptPointerLock: false,

  EnablePointerLock() {
    this.attemptPointerLock = true;
  },
  DisablePointerLock() {
    this.attemptPointerLock = false;
  },
  On(eventType, func) {
    if (this.events[eventType] !== undefined) this.events[eventType] = func;
  },
  Remove(eventType) {
    if (this.events[eventType] !== undefined) this.events[eventType] = null;
  },
  update() {
    if (this.isDown && this.events.hold) this.events.hold();
  }
};

window.addEventListener('mousedown', (e) => {
  if (Mouse.attemptPointerLock) document.querySelector("canvas").requestPointerLock();
  Mouse.isDown = true;
  if (!document.pointerLockElement && Mouse.events.down) Mouse.events.down(e);
  if (document.pointerLockElement && Mouse.events.lockDown) Mouse.events.lockDown(e);
});

window.addEventListener('mouseup', (e) => {
  Mouse.isDown = false;
  if (!document.pointerLockElement && Mouse.events.up) Mouse.events.up(e);
  if (document.pointerLockElement && Mouse.events.lockUp) Mouse.events.lockUp(e);
});

window.addEventListener('mousemove', (e) => {
  if (!document.pointerLockElement && Mouse.events.move) Mouse.events.move(e);
  if (document.pointerLockElement && Mouse.events.lockMove) Mouse.events.lockMove(e);
});


window.addEventListener('blur', () => {
  Keyboard.keys = {};
  Mouse.isDown = false;
});

export function Update() {
  Keyboard.update();
  Mouse.update();
}
