export type NotificationType = 'warning' | 'danger' | 'loading';

export type LinkType = {
  text: string;
  href: string;
};

export type Props = {
  id: string;
  type?: NotificationType;
  title?: string;
  content?: string;
  links?: LinkType[];
  LinkComponent?: JSX.Element;
  visible: () => void;
  pause: () => void;
  unpause: () => void;
  close: (id: string) => void;
};
