import { getMapKey } from './help';

let upKeys = [];
const shortcuts = {};
const hints = {};
let activeHints = null;
let setup = false;

export function start() {
  if (setup) {
    return;
  }
  setup = true;

  document.addEventListener('keydown', e => {
    if (!upKeys.some(keyCode => keyCode === e.keyCode)) {
      upKeys.push(e.keyCode);
    }

    const objects = shortcuts[getMapKey(upKeys)];
    if (objects) {
      e.preventDefault();
      objects.forEach(object => object.shortcutPressed());
    }

    const hintObjects = hints[getMapKey(upKeys)];

    if (activeHints) {
      activeHints.forEach(object => object.hintReleased());
      activeHints = null;
    }
    activeHints = hintObjects;

    if (hintObjects) {
      hintObjects.forEach(object => object.hintPressed());
    }
  });

  document.addEventListener('keyup', e => {
    upKeys = upKeys.filter(keyCode => keyCode !== e.keyCode);

    if (activeHints) {
      activeHints.forEach(object => object.hintReleased());
      activeHints = null;
    }
  });
}

export function bind(object) {
  start();

  // TODO
  shortcuts[object.shortcut] = [object];
  hints[object.hint] = [object];
}

export function unbind(object) {
  shortcuts[object.shortcut] = shortcuts[object.shortcut].filter(cb => cb !== object);
  hints[object.hint] = hints[object.hint].filter(cb => cb !== object);
}