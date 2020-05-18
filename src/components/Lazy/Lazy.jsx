import { Component } from 'preact';
import omit from 'lodash.omit';

import { Container } from 'components/Container/Container';
import { Spinner } from 'components/Spinner/Spinner';

export class Lazy extends Component {
  state = { loading: false };

  componentDidMount() {
    this.update();
  }

  componentDidUpdate({ loading }) {
    if (this.props.loading !== loading) this.update();
  }

  update() {
    const { loading, name } = this.props;

    this.setState({ loading: true });
    loading().then(m => {
      if (loading !== this.props.loading) return;
      this.C = name ? m.default[name] : m.default;
      this.setState({ loading: false });
    });
  }

  render() {
    if (this.state.loading || !this.C) {
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
