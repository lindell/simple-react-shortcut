import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import { bind, unbind } from './shared';
import { parseKeys, getMapKey } from './help';

const supportedElements = {
  INPUT: {
    functionName: 'focus'
  },
  BUTTON: {
    functionName: 'click'
  }
};

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
    this.action = this.props.action;
    this.shortcutPressed = this.shortcutPressed.bind(this);
  }

  shortcutPressed() {
    const child = findDOMNode(this);
    if (child === undefined) {
      return;
    }

    // If the element is the first element
    const elementSettings = supportedElements[child.nodeName];
    if (elementSettings) {
      this.handleElement(child);
    }

    const querySelector = Object.keys(supportedElements).join(',');
    const selectedElement = child.querySelector(querySelector);
    if (selectedElement) {
      this.handleElement(selectedElement);
    }
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
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

Shortcut.defaultProps = {
  action: undefined
};