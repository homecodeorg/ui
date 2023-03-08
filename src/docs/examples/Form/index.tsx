import { Heading, Link } from 'uilib';
import { ComponentLayout } from 'docs/components';

import example from '!!raw-loader!./Example';
import { TypesTable } from 'uilib/docs/components/TypesNavigator/TypesNavigator';

const name = 'Form';
const Docs = () => (
  <>
    <p>
      Provides a comprehensive solution for managing the entire lifecycle of web
      forms.
    </p>
    <p>
      From defining initial values and validation rules to handling user input
      and submitting the form, this component streamlines the entire process and
      offers a flexible, customizable API for building robust forms with ease.
    </p>
    <p>
      <Link inline href="/demo">
        Demo
      </Link>
    </p>
    <Heading id="Props" text="Props" />
    <TypesTable
      scope={name}
      type="Props"
      customLinks={{ FormAPI: '#FormAPI' }}
    />

    <Heading id="FormAPI" text="FormAPI" />
    <TypesTable
      scope={name}
      type="FormAPI"
      hideRequiredStart
      customLinks={{ FormFieldProps: '#FormFieldProps' }}
    />

    <Heading id="FormFieldProps" text="FormFieldProps" />
    <TypesTable scope={name} type="FormFieldProps" hideRequiredStart />
  </>
);

export default () => (
  <ComponentLayout
    name={name}
    docs={Docs}
    examples={[{ id: 'demo', label: 'Demo', code: example }]}
    scope={{}}
  />
);
