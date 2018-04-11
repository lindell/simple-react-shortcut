import React, { Component } from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';

import { bind, unbind } from './shared';

export default class Shortcut extends Component {
  constructor(props) {
    super(props);
    this.keys = this.props.shortcut.split('+').map(key => keycode(key.trim()));
    this.ref = React.createRef();

    this.keyPress = this.keyPress.bind(this);
  }

  componentWillMount() {
    bind(this.keys, this.keyPress);
  }

  componentWillUnmount() {
    unbind(this.keys, this.keyPress);
  }

  keyPress() {
    const input = this.ref.current.querySelector('input');
    input.focus();
  }

  render() {
    return <div ref={this.ref}>{this.props.children}</div>;
  }
}

Shortcut.propTypes = {
  shortcut: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
