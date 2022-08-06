import { Component } from 'react';

import STORE from './store';

type Props = { to: string };

export class Redirect extends Component<Props> {
  constructor(props) {
    super(props);
    STORE.replaceState(props.to, { replace: true });
  }

  render() {
    return null;
  }
}
