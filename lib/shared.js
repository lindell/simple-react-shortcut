let upKeys = [];
const shortcuts = {};
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
    const callbacks = shortcuts[upKeys.sort().join()];
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  });

  document.addEventListener('keyup', e => {
    upKeys = upKeys.filter(keyCode => keyCode !== e.keyCode);
  });
}

export function bind(keys, callback) {
  start();

  const key = keys.sort().join();
  shortcuts[key] = [callback];
}

export function unbind(keys, callback) {
  const key = keys.sort().join();
  shortcuts[key] = shortcuts[key].filter(cb => cb !== callback);
}