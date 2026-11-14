import { Button, Stepper } from 'uilib';

const steps = [1, 2, 3].map(n => ({
  id: n,
  title: `Step ${n}`,
  description: 'Buttons drawn by renderButtons',
  content: <div>Content {n}</div>,
}));

export default () => (
  <Stepper
    size="s"
    steps={steps}
    renderButtons={({ prev, next, isFirst, isLast }) => (
      <>
        <Button round size="s" disabled={isFirst} onClick={prev}>
          Back
        </Button>{' '}
        <Button round size="s" variant="primary" disabled={isLast} onClick={next}>
          Continue
        </Button>
      </>
    )}
  />
);
