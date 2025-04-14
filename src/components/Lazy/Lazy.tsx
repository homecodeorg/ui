import { Component, ComponentType } from 'react';
import Time from 'timen';
import { createStore } from 'justorm/react';

import { Container } from '../Container/Container';
import { Spinner } from '../Spinner/Spinner';
import * as T from './Lazy.types';
import { Flex } from 'uilib/components/Flex/Flex';

function compare(cb1: T.Loader, cb2: T.Loader) {
  return cb1?.toString() === cb2?.toString();
}

const loaded = new Map<T.Loader, T.ImportData>();

export type LazyProps = T.Props;

export class Lazy extends Component<T.Props> {
  store: T.State;

  importData?: T.ImportData;
  DefaultNode?: ComponentType<any>;

  isLoaded = false;
  clearSpinnerTimeout: null;

  static defaultProps = {
    size: 'm',
  };

  constructor(props: T.Props) {
    super(props);

    this.importData = loaded.get(this.props.loader);
    this.DefaultNode = this.importData?.default;

    const isLoaded = !!this.importData;

    this.store = createStore(this, {
      loading: !isLoaded,
      spinnerTimeout: isLoaded,
    });
  }

  componentDidMount() {
    if (!this.importData) this.update();
  }

  componentDidUpdate({ loader }) {
    if (!compare(this.props.loader, loader)) {
      // @ts-ignore
      this.clearSpinnerTimeout?.();
      this.update();
    }
  }

  update() {
    const { loader, spinnerTimeout = 500 } = this.props;

    this.clearSpinnerTimeout = Time.after(spinnerTimeout, () =>
      this.setState({ spinnerTimeout: false })
    );

    this.store.loading = true;
    loader().then((data: T.ImportData) => {
      if (!compare(this.props.loader, loader)) return;

      this.importData = data;
      this.DefaultNode = data.default;
      loaded.set(loader, data);

      this.store.loading = false;
    });
  }

  render() {
    const { DefaultNode, importData } = this;
    const { progressElem, loader, render, children, hideSpinner, ...props } =
      this.props;
    const { loading, spinnerTimeout } = this.store;

    if (loading && !spinnerTimeout && !hideSpinner) {
      return (
        progressElem ?? (
          <Flex
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
            width="100%"
            height="100%"
          >
            <Spinner size={props.size} />
          </Flex>
        )
      );
    }

    if (render) return render(importData);
    if (typeof children === 'function') return children(importData);
    if (DefaultNode) return <DefaultNode {...props} />;

    return children;
  }
}
