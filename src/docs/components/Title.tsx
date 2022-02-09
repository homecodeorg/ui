type Props = {
  text: string;
  As?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export function Title({ text, As = 'h1' }: Props) {
  return <As style={{ marginBottom: 10 }}>{text}</As>;
}
