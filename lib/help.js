/* eslint-disable import/prefer-default-export */

import keycode from 'keycode';

export function parseKeys(shortcut) {
  if (typeof shortcut === 'string') {
    return shortcut.split('+').map(key => keycode(key.trim()));
  } else if (Array.isArray(shortcut)) {
    return shortcut.map(key => keycode(key.trim()));
  }
  throw new Error("Can't convert shortcut");
}

export function getMapKey(keyValues) {
  return [...keyValues].sort().join();
}