import { Component, createRef } from 'react';
import cn from 'classnames';

import { InputProps } from '../Input/Input';
import { ComponentType } from '../../types';

import S from './InputFile.styl';

type Props = ComponentType &
  InputProps & {
    onClick: (e: MouseEvent) => void;
    isLoading?: boolean;
  };

class InputFile extends Component<Props> {
  controlEl = createRef<HTMLInputElement>();

  state = {
    fileName: '',
  };

  onClick = e => {
    const { onClick } = this.props;

    const input = this.controlEl.current;

    input.click();
    input.focus();

    if (onClick) onClick(e);
  };

  onChange = e => {
    const { onChange } = this.props;
    const fileName = e.target.files[0];

    this.setState({ fileName });
    onChange(e, fileName);
  };

  render() {
    const { className, isLoading, label, ...props } = this.props;
    const { fileName } = this.state;
    const classes = cn(
      S.control,
      isLoading && S.loading,
      fileName && S.hasValue
    );

    return (
      <div className={className}>
        {label && (
          <label htmlFor={props.name} className={S.label}>
            {label}
          </label>
        )}
        <div
          // className={this.styles.decor}
          onClick={this.onClick}
          alt={fileName}
        >
          <input
            {...props}
            type="file"
            id={props.name}
            className={classes}
            ref={this.controlEl}
            onChange={this.onChange}
          />
          <div className={S.filePlaceholder}>
            <div className={S.filePlaceholderInner}>
              {fileName || 'Choose file'}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default InputFile;
