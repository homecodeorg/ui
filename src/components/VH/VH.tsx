import { Component } from 'react';

type State = { vh: number };

export class VH extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = { vh: this.getVH() };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateVH);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateVH);
  }

  getVH = () => window.innerHeight / 100;

  updateVH = () => {
    this.setState({ vh: this.getVH() });
  };

  render() {
    const { vh } = this.state;
    return <style>{`:root{--vh: ${vh}px;}`}</style>;
  }
}
