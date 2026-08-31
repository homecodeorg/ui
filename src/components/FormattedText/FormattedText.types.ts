export type FormattedTextProps = {
  text: string;
  className?: string;
  onButtonClick?: (params: { text: string; [name: string]: string }) => void;
};
