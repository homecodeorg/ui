import { Component } from 'react';
import { createStore } from 'justorm/react';

export default class State extends Component {
  store;

  constructor(props) {
    super(props);
    this.store = createStore(this, props.initial);
  }

  render() {
    return this.props.children(this.store);
  }
}
