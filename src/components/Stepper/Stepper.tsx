import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Button } from 'uilib/components/Button/Button';
import Dots from 'uilib/components/Gallery/Dots/Dots';

import S from './Stepper.styl';
import * as T from './Stepper.types';

export type {
  Step as StepperStep,
  StepButton as StepperButton,
  StepperApi,
  Props as StepperProps,
} from './Stepper.types';

function indexOf(steps: T.Step[], id?: string | number) {
  const i = steps.findIndex(s => s.id === id);
  return i < 0 ? 0 : i;
}

function textOf(node: ReactNode) {
  return typeof node === 'string' || typeof node === 'number'
    ? String(node)
    : '';
}

export function Stepper({
  steps,
  activeId,
  defaultActiveId,
  onChange,
  size = 'm',
  prevLabel = 'Prev',
  nextLabel = 'Next',
  prevButtonProps,
  nextButtonProps,
  renderPrevButton,
  renderNextButton,
  showDots = true,
  dotsClickable = true,
  renderAll = false,
  animation = true,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
}: T.Props) {
  const controlled = activeId !== undefined;
  const [ownId, setOwnId] = useState(
    () => defaultActiveId ?? steps[0]?.id
  );
  const currentId = controlled ? activeId : ownId;
  const index = indexOf(steps, currentId);
  const step = steps[index];
  const count = steps.length;

  // The direction of the last move, for the slide.
  const prevIndex = useRef(index);
  const [dir, setDir] = useState<'forward' | 'back' | null>(null);
  useEffect(() => {
    if (index !== prevIndex.current) {
      setDir(index > prevIndex.current ? 'forward' : 'back');
      prevIndex.current = index;
    }
  }, [index]);

  // A step that went away (steps changed): fall back to the nearest one.
  useEffect(() => {
    if (!controlled && step && step.id !== ownId) setOwnId(step.id);
  }, [controlled, step?.id, ownId]);

  if (!step) return null;

  const go = (i: number) => {
    const target = steps[Math.max(0, Math.min(count - 1, i))];
    if (!target || target.id === step.id) return;
    if (!controlled) setOwnId(target.id);
    onChange?.(target.id, steps.indexOf(target));
  };

  const api: T.StepperApi = {
    index,
    count,
    step,
    isFirst: index === 0,
    isLast: index === count - 1,
    prev: () => go(index - 1),
    next: () => go(index + 1),
    go,
  };

  const button = (kind: 'prev' | 'next') => {
    const own = step[kind];
    const common = kind === 'prev' ? prevButtonProps : nextButtonProps;
    if (own === false || (own === undefined && common === false)) {
      return <span className={S.placeholder} />;
    }

    const props = { ...(common || {}), ...(own || {}) };
    const { onClick, children, ...rest } = props;
    const isPrev = kind === 'prev';
    // Nowhere to go and nothing else to do.
    const stuck = isPrev ? api.isFirst : api.isLast && !onClick;

    if (isPrev && api.isFirst && !onClick) {
      return <span className={S.placeholder} />;
    }

    return (
      <Button
        round
        size={size}
        variant={isPrev ? 'clear' : 'primary'}
        disabled={stuck}
        {...rest}
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          if (onClick?.(e) === false || e.defaultPrevented) return;
          if (isPrev) api.prev();
          else api.next();
        }}
      >
        {children ?? (isPrev ? prevLabel : nextLabel)}
      </Button>
    );
  };

  const renderContent = (s: T.Step) =>
    typeof s.content === 'function'
      ? s.content(s === step ? api : { ...api, step: s })
      : s.content;

  const renderStep = (s: T.Step, active: boolean) => (
    <div
      key={s.id}
      className={cn(
        S.step,
        active && animation && dir && S[dir],
        !active && S.hidden
      )}
      aria-hidden={!active || undefined}
    >
      {(s.title || s.description) && (
        <div className={cn(S.header, headerClassName)}>
          {s.title && <div className={S.title}>{s.title}</div>}
          {s.description && (
            <div className={S.description}>{s.description}</div>
          )}
        </div>
      )}
      <div className={cn(S.content, contentClassName)}>{renderContent(s)}</div>
    </div>
  );

  return (
    <div className={cn(S.root, S[`size-${size}`], className)}>
      <div className={S.body}>
        {steps.map(s =>
          s === step || renderAll || s.forceRender
            ? renderStep(s, s === step)
            : null
        )}
      </div>

      <div className={cn(S.footer, footerClassName)}>
        <div className={S.prev}>
          {renderPrevButton
            ? renderPrevButton(api, button('prev'))
            : button('prev')}
        </div>
        {showDots && count > 1 && (
          <Dots
            index={index}
            count={count}
            className={S.dots}
            onSelect={dotsClickable ? go : undefined}
            getLabel={i => textOf(steps[i].title) || String(i + 1)}
          />
        )}
        <div className={S.next}>
          {renderNextButton
            ? renderNextButton(api, button('next'))
            : button('next')}
        </div>
      </div>
    </div>
  );
}
