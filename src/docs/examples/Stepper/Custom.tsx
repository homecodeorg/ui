import { Button, Stepper } from 'uilib';

const steps = [1, 2, 3].map(n => ({
  id: n,
  title: `Step ${n}`,
  description: 'Own buttons on both sides',
  content: <div>Content {n}</div>,
}));

export default () => (
  <Stepper
    size="s"
    steps={steps}
    renderPrevButton={({ prev, isFirst }) => (
      <Button round size="s" disabled={isFirst} onClick={prev}>
        Back
      </Button>
    )}
    renderNextButton={({ isLast }, next) => (
      <>
        <Button round size="s" variant="clear" disabled={isLast}>
          Skip
        </Button>
        {next}
      </>
    )}
    nextLabel="Continue"
  />
);
