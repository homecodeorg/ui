import { Component } from 'preact';

export class VH extends Component {
  constructor(props) {
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
