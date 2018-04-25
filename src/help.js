import keycode from 'keycode';
import { findDOMNode } from 'react-dom';
import supportedElements from './supportedElements';

// Get keycodes from string of arrays
export function parseKeys(shortcutArray) {
  return shortcutArray.map(key => keycode(key.trim()));
}

export function getMapKey(keyValues) {
  return [...keyValues].sort().join();
}

export function getElement(object) {
  const child = findDOMNode(object);
  if (child === undefined) {
    return null;
  }

  // If the element is the first element
  const elementSettings = supportedElements[child.nodeName];
  if (elementSettings) {
    return child;
  }

  // Search for a child element that has a supported type
  const querySelector = Object.keys(supportedElements).join(',');
  const selectedElement = child.querySelector(querySelector);
  if (selectedElement) {
    return selectedElement;
  }

  return null;
}

export function normalizeShortcutInput(input) {
  if (typeof input === 'string') {
    return input.split('+').map(key => key.trim());
  } else if (Array.isArray(input)) {
    return input.map(key => key.trim());
  }
  throw new Error("Can't convert input");
}
