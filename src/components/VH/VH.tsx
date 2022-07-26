import { Component } from 'react';
import { isBrowser } from 'uilib/tools';

type State = { vh: number };

const getVH = () => (isBrowser ? window.innerHeight / 100 : 0);

export class VH extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = { vh: 0 };
  }

  componentDidMount() {
    this.updateVH();
    window.addEventListener('resize', this.updateVH);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateVH);
  }

  updateVH = () => {
    this.setState({ vh: getVH() });
  };

  render() {
    const { vh } = this.state;
    return <style>{`:root{--vh: ${vh}px;}`}</style>;
  }
}
