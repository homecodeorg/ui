import cn from 'classnames';
import { forwardRef, useEffect, useRef } from 'react';

import { Scroll, type ScrollRef } from 'uilib/components/Scroll/Scroll';

import S from './Card.styl';
import type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardTitleProps,
  LinkCardProps,
} from './Card.subtypes';
import type { Props as CardProps } from './Card.types';

const SCROLL_OFFSET = 300;

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, paddingSize = 'm', blur = false, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        S.root,
        S[`padding-${paddingSize}`],
        blur && S.blur,
        className
      )}
      {...props}
    />
  );
});

function LinkCard({ className, ...props }: LinkCardProps) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      data-slot="link-card"
      className={cn(S.root, className)}
      {...props}
    />
  );
}

function CardHeader({
  className,
  icon,
  iconWithBackground = false,
  textsClassName,
  title,
  titleClassName,
  titleId,
  description,
  descriptionClassName,
  descriptionId,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div data-slot="card-header" className={cn(S.header, className)} {...props}>
      {icon && (
        <div className={cn(S.icon, iconWithBackground && S.withBackground)}>
          {icon}
        </div>
      )}
      {children}
      {(title || description) && (
        <div className={cn(S.headerText, textsClassName)}>
          {title && (
            <CardTitle id={titleId} className={titleClassName}>
              {title}
            </CardTitle>
          )}
          {description && (
            <CardDescription
              id={descriptionId}
              className={descriptionClassName}
            >
              {description}
            </CardDescription>
          )}
        </div>
      )}
    </div>
  );
}

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <div data-slot="card-title" className={cn(S.title, className)} {...props} />
  );
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn(S.description, className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(S.action, className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  centered,
  fullHeight,
  noScroll,
  children,
  autoScrollBottom,
  ...props
}: CardContentProps) {
  const scrollRef = useRef<ScrollRef>(null);

  const contentDiv = (
    <div
      data-slot="card-content"
      className={cn(
        className,
        centered && S.centered,
        fullHeight && S.fullHeight
      )}
      {...props}
    >
      {children}
    </div>
  );

  useEffect(() => {
    if (noScroll || !autoScrollBottom) return;

    const inner = scrollRef.current?.innerElem;
    if (!inner) return;

    if (inner.scrollHeight > SCROLL_OFFSET) {
      inner.scrollTo({
        top: inner.scrollHeight - inner.offsetHeight - SCROLL_OFFSET,
        behavior: 'auto',
      });
    }

    const t = window.setTimeout(() => {
      const top = inner.scrollHeight + 1000;
      inner.scrollTo({ top, behavior: 'smooth' });
    }, 0);

    return () => window.clearTimeout(t);
  }, [noScroll, autoScrollBottom]);

  if (noScroll) return contentDiv;

  return (
    <Scroll y autoHide fadeSize="m" className={S.scroll} ref={scrollRef}>
      {contentDiv}
    </Scroll>
  );
}

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(S.footer, className)}
      {...props}
    />
  );
}

export {
  Card,
  LinkCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
