import { getMapKey } from './help';

let upKeys = [];
const shortcuts = {};
let setup = false;

export function start() {
  if (setup) {
    return;
  }
  setup = true;

  document.addEventListener('keydown', (e) => {
    if (!upKeys.some(keyCode => keyCode === e.keyCode)) {
      upKeys.push(e.keyCode);
    }

    const objects = shortcuts[getMapKey(upKeys)];
    if (objects) {
      e.preventDefault();
      objects.forEach(object => object.shortcutPressed());
    }
  });

  document.addEventListener('keyup', (e) => {
    upKeys = upKeys.filter(keyCode => keyCode !== e.keyCode);
  });
}

export function bind(object) {
  start();

  // TODO
  shortcuts[object.shortcut] = [object];
}

export function unbind(object) {
  shortcuts[object.shortcut] = shortcuts[object.shortcut].filter(cb => cb !== object);
}
