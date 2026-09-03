import { Button, FoldedLine, FoldedLineAction } from 'uilib';

export default () => (
  <>
    <FoldedLine trigger="Default rail" defaultFolded={false}>
      <p>
        Click the trigger or Fold to collapse. Extra actions register into the
        bottom-right tray.
      </p>
      <FoldedLineAction>
        <Button size="xs" variant="primary">
          Extra
        </Button>
      </FoldedLineAction>
    </FoldedLine>

    <br />

    <FoldedLine trigger="Starts folded">
      <p>Long body sits in a scroll area when contentScrolling is on.</p>
      <p>Second paragraph to show overflow.</p>
      <p>Third paragraph.</p>
    </FoldedLine>

    <br />

    <FoldedLine
      variant="clear"
      hideFoldButton
      showChevron={false}
      contentScrolling={false}
      trigger="Clear variant — click anywhere"
    >
      <p>No gutter, no fold button, no chevron. Whole row toggles.</p>
    </FoldedLine>
  </>
);
