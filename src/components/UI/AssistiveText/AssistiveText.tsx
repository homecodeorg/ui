import S from './AssistiveText.styl';
import cn from 'classnames';

export type Props = {
  className?: string;
  size?: 's' | 'm' | 'l';
  variant?: 'default' | 'danger';
  children: JSX.Node;
  style?: JSX.HTMLAttributes['style'];
};

export default function AssistiveText(props: Props) {
  const {
    className,
    size = 'm',
    variant = 'default',
    children,
    ...rest
  } = props;

  return (
    <div
      className={cn(
        S.root,
        S[`size-${size}`],
        S[`variant-${variant}`],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
