import type { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

import type { Props as CardProps } from './Card.types';

export type CardHeaderProps = Omit<React.ComponentProps<'div'>, 'title'> & {
  className?: string;
  textsClassName?: string;
  icon?: React.ReactNode;
  iconWithBackground?: boolean;
  title?: React.ReactNode;
  titleClassName?: string;
  titleId?: string;
  description?: React.ReactNode;
  descriptionClassName?: string;
  descriptionId?: string;
};

export type CardTitleProps = React.ComponentProps<'div'>;

export type CardDescriptionProps = React.ComponentProps<'div'>;

export type CardActionProps = React.ComponentProps<'div'>;

export type CardContentProps = React.ComponentProps<'div'> & {
  centered?: boolean;
  fullHeight?: boolean;
  noScroll?: boolean;
  autoScrollBottom?: boolean;
};

export type CardFooterProps = React.ComponentProps<'div'>;

export type LinkCardProps = CardProps &
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
