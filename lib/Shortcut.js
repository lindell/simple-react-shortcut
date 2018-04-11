import React, { Component } from "react";
import { bind, unbind } from "./shared";
import keycode from "keycode";

export default class Shortcut extends Component {
  constructor(props) {
    super(props);
    this.keys = this.props.shortcut.split("+").map(key => keycode(key.trim()));
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
    let input = this.ref.current.querySelector("input");
    input.focus();
  }

  render() {
    return React.createElement(
      "div",
      { ref: this.ref },
      this.props.children
    );
  }
}