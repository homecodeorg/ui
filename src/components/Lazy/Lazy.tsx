import { Component } from 'react';

import omit from 'lodash.omit';

import { Container } from '../Container/Container';
import { Spinner } from '../Spinner/Spinner';

type Loader = () => Promise<void>;
type Props = { loading: Loader };
type State = { loading: boolean };

function compare(cb1: Loader, cb2: Loader) {
  return cb1?.toString() === cb2?.toString();
}

export default class Lazy extends Component<Props, State> {
  state = { loading: false };
  C: any;

  componentDidMount() {
    this.update();
  }

  componentDidUpdate({ loading }: Props) {
    if (!compare(this.props.loading, loading)) this.update();
  }

  update() {
    const { loading } = this.props;

    this.setState({ loading: true });
    loading().then((m: any) => {
      if (!compare(this.props.loading, loading)) return;
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
