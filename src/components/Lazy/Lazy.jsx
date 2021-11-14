import { Component } from 'preact';

import omit from 'lodash.omit';

import { Container } from 'components/Container/Container';
import { Spinner } from 'components/Spinner/Spinner';

function compare(cb1, cb2) {
  return cb1?.toString() === cb2?.toString();
}

export default class Lazy extends Component {
  state = { loading: false };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate({ loading }) {
    if (!compare(this.props.loading, loading)) this.update();
  }

  update() {
    const { loading } = this.props;

    this.setState({ loading: true });
    loading().then(m => {
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
