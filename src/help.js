import keycode from 'keycode';
import { findDOMNode } from 'react-dom';
import { supportedElements } from './settings';

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
