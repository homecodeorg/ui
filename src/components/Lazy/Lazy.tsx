import { Component } from 'react';

import omit from 'lodash.omit';

import { Container } from '../Container/Container';
import { Spinner } from '../Spinner/Spinner';

type Loader = () => Promise<any>;
type Props = { loader: Loader };
type State = { loading: boolean };

function compare(cb1: Loader, cb2: Loader) {
  return cb1?.toString() === cb2?.toString();
}

export class Lazy extends Component<Props, State> {
  state = { loading: true };
  C: any;

  componentDidMount() {
    this.update();
  }

  componentDidUpdate({ loader }: Props) {
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
    if (this.state.loading) {
      return (
        <Container centered fullHeight>
          <Spinner size="l" />
        </Container>
      );
    }

    const { C, props } = this;

    return <C {...omit(props, ['loading'])} />;
  }
}
