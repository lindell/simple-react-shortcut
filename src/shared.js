import { getMapKey, parseKeys } from './help';
import config from './config';

let downKeys = [];
const shortcuts = {};
let hintsShowing = false;
let setup = false;
let allObjects = [];

function showHintIfPressed() {
  const hintKeys = getMapKey(parseKeys(config.hintKeys));

  if (!hintsShowing && hintKeys === getMapKey(downKeys)) {
    allObjects.forEach(object => object.hintPressed());
    hintsShowing = true;
  } else if (hintsShowing && hintKeys !== getMapKey(downKeys)) {
    allObjects.forEach(object => object.hintReleased());
    hintsShowing = false;
  }
}

export function start() {
  if (setup) {
    return;
  }
  setup = true;

  document.addEventListener('keydown', (e) => {
    if (!downKeys.some(keyCode => keyCode === e.keyCode)) {
      downKeys.push(e.keyCode);
    }

    const objects = shortcuts[getMapKey(downKeys)];
    if (objects) {
      e.preventDefault();
      objects.forEach(object => object.shortcutPressed());
    }

    showHintIfPressed();
  });

  document.addEventListener('keyup', (e) => {
    downKeys = downKeys.filter(keyCode => keyCode !== e.keyCode);

    showHintIfPressed();
  });
}


export function bind(object) {
  start();

  // TODO
  shortcuts[object.shortcut] = [object];
  allObjects.push(object);
}

export function unbind(object) {
  shortcuts[object.shortcut] = shortcuts[object.shortcut].filter(cb => cb !== object);
  allObjects = allObjects.filter(o => o !== object);
}
