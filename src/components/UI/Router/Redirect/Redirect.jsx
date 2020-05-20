import { Component } from 'preact';

import STORE from '../store';

export default class Redirect extends Component {
  constructor(props) {
    super(props);
    STORE.navigate(this.props.to, { replace: true });
  }

  render() {
    return null;
  }
}
