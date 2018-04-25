import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import supportedElements from './supportedElements';

import { bind, unbind } from './shared';
import { parseKeys, getMapKey, getElement, normalizeShortcutInput } from './help';

export default class Shortcut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shortcut: normalizeShortcutInput(props.shortcut)
    };

    this.prepareOptions(this);
  }

  componentWillMount() {
    bind(this);
  }

  componentWillUnmount() {
    unbind(this);
  }

  prepareOptions() {
    this.shortcut = getMapKey(parseKeys(this.state.shortcut));
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

    const hintElementWrapper = document.createElement('div');
    hintElementWrapper.style.position = 'absolute';
    hintElementWrapper.style.left = `${elem.offsetLeft}px`;
    hintElementWrapper.style.top = `${elem.offsetTop}px`;
    hintElementWrapper.style.width = `${elem.getBoundingClientRect().width}px`;
    hintElementWrapper.style.height = `${elem.getBoundingClientRect().height}px`;

    const Label = () => React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          right: 0,
          top: 0,
          transform: 'translate3D(50%, -50%, 0)',
          fontSize: '9px',
          background: '#3997d4',
          color: 'white',
          textTransform: 'uppercase',
          borderRadius: '2px',
          padding: '2px 3px',
          textShadow: '0 0 1px rgba(0, 0, 0, 0.3)'
        }
      },
      this.state.shortcut.join(' + ')
    );

    parent.insertBefore(hintElementWrapper, elem);

    ReactDOM.render(React.createElement(Label, null), hintElementWrapper);
    this.hintElement = hintElementWrapper;
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
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

Shortcut.defaultProps = {
  action: undefined
};