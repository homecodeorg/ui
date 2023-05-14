import { Component, ComponentType } from 'react';
import Time from 'timen';
import { createStore } from 'justorm/react';

import { Container } from '../Container/Container';
import { Spinner } from '../Spinner/Spinner';
import * as T from './Lazy.types';

function compare(cb1: T.Loader, cb2: T.Loader) {
  return cb1?.toString() === cb2?.toString();
}

const loaded = new Map<T.Loader, ComponentType>();

export class Lazy extends Component<T.Props> {
  store: T.State;
  Node?: ComponentType<any>;
  hasNode = false;
  clearSpinnerTimeout: null;

  static defaultProps = {
    size: 'm',
  };

  constructor(props: T.Props) {
    super(props);

    this.Node = loaded.get(this.props.loader);

    this.hasNode = Boolean(this.Node);

    this.store = createStore(this, {
      loading: !this.hasNode,
      spinnerTimeout: this.hasNode,
    });
  }

  componentDidMount() {
    if (!this.hasNode) this.update();
  }

  componentDidUpdate({ loader }) {
    if (!compare(this.props.loader, loader)) {
      // @ts-ignore
      this.clearSpinnerTimeout?.();
      this.update();
    }
  }

  update() {
    const { loader } = this.props;

    this.clearSpinnerTimeout = Time.after(500, () =>
      this.setState({ spinnerTimeout: false })
    );

    this.store.loading = true;
    loader().then(({ default: Node }: any) => {
      if (!compare(this.props.loader, loader)) return;
      this.Node = Node;
      loaded.set(loader, Node);
      this.store.loading = false;
    });
  }

  render() {
    const { Node } = this;
    const { progressElem, loader, hideSpinner, ...props } = this.props;
    const { loading, spinnerTimeout } = this.store;

    if (Node) return <Node {...props} />;

    if (!spinnerTimeout && loading && !hideSpinner) {
      return (
        progressElem ?? (
          <Container fullHeight fullWidth>
            <Spinner size={props.size} />
          </Container>
        )
      );
    }

    return null;
  }
}
