import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import { supportedElements } from './settings';

import { bind, unbind } from './shared';
import { parseKeys, getMapKey, getElement } from './help';

export default class Shortcut extends Component {
  constructor(props) {
    super(props);

    this.prepareOptions(this);
  }

  componentWillMount() {
    bind(this);
  }

  componentWillUnmount() {
    unbind(this);
  }

  prepareOptions() {
    this.shortcut = getMapKey(parseKeys(this.props.shortcut));
    this.hint = getMapKey(parseKeys(this.props.hint));
    this.action = this.props.action;
    this.shortcutPressed = this.shortcutPressed.bind(this);
  }

  shortcutPressed() {
    const elem = getElement(this);
    if (!elem) {
      return;
    }
    this.handleElement(elem);
  }

  hintPressed() {
    const elem = getElement(this);
    if (!elem) {
      return;
    }

    const parent = elem.parentElement;

    const hintElem = document.createElement('div');

    hintElem.innerHTML = this.props.shortcut;
    hintElem.style.position = 'absolute';
    hintElem.style.left = `${elem.offsetLeft}px`;
    hintElem.style.top = `${elem.offsetTop}px`;
    hintElem.style.width = `${elem.getBoundingClientRect().width}px`;
    hintElem.style.height = `${elem.getBoundingClientRect().height}px`;
    hintElem.style.background = 'rgba(0,0,0,0.2)';

    parent.insertBefore(hintElem, elem);
    this.hintElement = hintElem;
  }

  hintReleased() {
    this.hintElement.remove();
  }

  handleElement(element) {
    const elementSettings = supportedElements[element.nodeName];

    let func;
    if (typeof this.props.action === 'string') {
      func = elem => elem[this.props.action]();
    } else if (typeof this.props.action === 'function') {
      func = this.props.action;
    } else {
      func = elem => elem[elementSettings.functionName]();
    }

    func(element);
  }

  render() {
    return this.props.children;
  }
}

Shortcut.propTypes = {
  shortcut: PropTypes.string.isRequired,
  hint: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

Shortcut.defaultProps = {
  action: undefined
};