let upKeys = [];
let shortcuts = {};
let setup = false;

export function start() {
  if (setup) {
    return;
  }
  setup = true;

  document.addEventListener("keydown", function(e) {
    if (!upKeys.some(keyCode => keyCode === e.keyCode)) {
      upKeys.push(e.keyCode);
    }
    let callbacks = shortcuts[upKeys.sort().join()];
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
  });

  document.addEventListener("keyup", function(e) {
    upKeys = upKeys.filter(keyCode => keyCode !== e.keyCode);
  });
}

export function bind(keys, callback) {
  start();

  let key = keys.sort().join();
  shortcuts[key] = [callback];
}

export function unbind(keys, callback) {
  let key = keys.sort().join();
  shortcuts[key] = shortcuts[key].filter(cb => cb !== callback);
}
