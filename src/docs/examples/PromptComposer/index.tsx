import { Heading, Link } from 'uilib';
import { ComponentLayout, TypesTable } from 'docs/components';

import exampleCode from '!!raw-loader!./Example';

const Docs = () => (
  <>
    <p>
      Rich text prompt input powered by TipTap with slash commands.{' '}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope="PromptComposer" type="Props" />
  </>
);

export default () => (
  <ComponentLayout
    name="PromptComposer"
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: exampleCode }]}
  />
);
