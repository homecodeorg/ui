import { Component } from 'react';

import omit from 'lodash.omit';

import { Container } from '../Container/Container';
import { Spinner } from '../Spinner/Spinner';
import * as T from './Lazy.types';

function compare(cb1: T.Loader, cb2: T.Loader) {
  return cb1?.toString() === cb2?.toString();
}

export class Lazy extends Component<T.Props, T.State> {
  state = { loading: true };
  C: any;

  componentDidMount() {
    this.update();
  }

  componentDidUpdate({ loader }) {
    if (!compare(this.props.loader, loader)) this.update();
  }

  update() {
    const { loader } = this.props;

    this.setState({ loading: true });
    loader().then((m: any) => {
      if (!compare(this.props.loader, loader)) return;
      this.C = m.default;
      this.setState({ loading: false });
    });
  }

  render() {
    const { C, props } = this;

    if (this.state.loading) {
      return (
        props.progressElem ?? (
          <Container fullHeight fullWidth>
            <Spinner size="l" />
          </Container>
        )
      );
    }

    return <C {...omit(props, ['loading'])} />;
  }
}
