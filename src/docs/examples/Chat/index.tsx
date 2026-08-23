import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import message from '!!raw-loader!./Message';
import dialogue from '!!raw-loader!./Dialogue';
import S from './Chat.styl';

const name = 'Chat';
const Docs = () => (
  <>
    <p>
      Conversation message and dialogue view with formatted text, system events,
      and a prompt footer.{' '}
      <Link inline href="/message">
        Message
      </Link>
      {' · '}
      <Link inline href="/dialogue">
        Dialogue
      </Link>
    </p>

    <Heading id="props-message" text="ChatMessage props" />
    <TypesTable scope={name} type="ChatMessageProps" />

    <Heading id="props-view" text="ChatView props" />
    <TypesTable scope={name} type="ChatViewProps" />

    <Heading id="props-prompt" text="ChatPrompt props" />
    <TypesTable scope={name} type="ChatPromptProps" />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[
      { id: 'message', label: 'Message', code: message },
      { id: 'dialogue', label: 'Dialogue', code: dialogue },
    ]}
    scope={{ S }}
  />
);
