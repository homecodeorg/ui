import { Heading } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import example from '!!raw-loader!./Example';
import inline from '!!raw-loader!./Inline';

const name = 'EmojiSelector';
const Docs = () => (
  <>
    <p>
      Emoji-only picker like the macOS one: search by name, frequently used
      first, categories with a tab bar at the bottom, arrow keys to move and
      Enter to pick the first search result. The emoji list loads the first
      time a selector opens. Put it in a Popup to open it from a button.
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'popup', label: 'In a Popup', code: example },
      { id: 'inline', label: 'Inline', code: inline },
    ]}
  />
);
