import { Component } from 'react';

import STORE from './store';

type Props = { to: string };

export class Redirect extends Component<Props> {
  componentDidMount(): void {
    STORE.replaceState(this.props.to, { replace: true });
  }

  render() {
    return null;
  }
}
