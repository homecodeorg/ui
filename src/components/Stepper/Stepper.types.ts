import { ReactNode } from 'react';
import { Props as ButtonProps } from '../Button/Button.types';
import { Size } from 'uilib/types';

type ID = string | number;

// A footer button: Button props (children is its label). `false` hides it.
// An `onClick` that returns `false` (or calls `preventDefault`) keeps the step.
export type StepButton =
  | false
  | (Omit<Partial<ButtonProps>, 'onClick'> & {
      onClick?: (e: React.MouseEvent<HTMLButtonElement>) => boolean | void;
    });

export type StepperApi = {
  index: number;
  count: number;
  step: Step;
  isFirst: boolean;
  isLast: boolean;
  prev: () => void;
  next: () => void;
  go: (index: number) => void;
};

export type Step = {
  id: ID;
  // Shown on top of the step
  title?: ReactNode;
  // A short line under the title
  description?: ReactNode;
  content?: ReactNode | ((api: StepperApi) => ReactNode);
  // Stay mounted (hidden) while another step is shown
  forceRender?: boolean;
  // Overrides the Stepper's Prev button for this step
  prev?: StepButton;
  // Overrides the Stepper's Next button for this step
  next?: StepButton;
};

export type Props = {
  steps: Step[];
  // The current step (controlled)
  activeId?: ID;
  // The first step shown when `activeId` is not set
  defaultActiveId?: ID;
  onChange?: (id: ID, index: number) => void;
  size?: Size;
  // Label of the Prev button
  prevLabel?: ReactNode;
  // Label of the Next button
  nextLabel?: ReactNode;
  // Props for every Prev button (a step's `prev` wins)
  prevButtonProps?: StepButton;
  // Props for every Next button (a step's `next` wins)
  nextButtonProps?: StepButton;
  // Draws the footer buttons instead of Prev/Next; the dots stay
  renderButtons?: (api: StepperApi) => ReactNode;
  // Dots under the step, like in Gallery
  showDots?: boolean;
  // Clicking a dot opens its step
  dotsClickable?: boolean;
  // Keep every step mounted, hiding the inactive ones
  renderAll?: boolean;
  // Slide between steps
  animation?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
};
