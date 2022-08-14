import Time from 'timen';
import { Heading, Icon, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import S from './Example.styl';
import example from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

const name = 'Lazy';
const Docs = () => (
  <>
    <p>
      UI component that enables lazy loading of content by displaying a loader
      animation while the content is being fetched.{` `}
      <Link inline href="/demo">
        Demo
      </Link>
    </p>

    <Heading id="props" text="Props" />
    <TypesTable scope={name} type="Props" />
  </>
);

const LazyComponentExample = () =>
  new Promise(resolve => {
    Time.after(1000, () =>
      resolve({
        default: () => (
          <div className={S.placeholder}>
            <Icon type="check" />
            &nbsp; This content is lazy loaded
          </div>
        ),
      })
    );
  });

export default () => (
  <>
    <ComponentLayout
      name={name}
      docs={Docs}
      examples={[
        {
          id: 'demo',
          label: 'Demo',
          code: example,
          scope: { S, LazyComponentExample },
        },
      ]}
      scope={{}}
    />
    {/* preload icon to show pure example */}
    <Icon type="check" />
  </>
);
