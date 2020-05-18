import { storiesOf } from '@storybook/preact';

import { Title } from 'storybook.helpers';

import Form from 'components/Form/Form';
import AssistiveText from 'components/AssistiveText/AssistiveText';
import Container from 'components/Container/Container';
import Checkbox from 'components/Checkbox/Checkbox';
import Select from 'components/Select/Select';
import Button from './Button';

const SIZES = [
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
];
const VARIANTS = [
  { id: 'default', label: 'Default' },
  { id: 'primary', label: 'Primary' },
  { id: 'clear', label: 'Clear' },
];
const INITIAL_PROPS = {
  size: 'm',
  variant: 'default',
  isLoading: false,
};

storiesOf('Button').add('default', () => (
  <Form initialValues={INITIAL_PROPS}>
    {({ Field, values }) => (
      <Container style={{ maxWidth: 600 }} centeredH>
        <Container vertical style={{ flexGrow: 1 }}>
          <Title text="Props:" />
          <Field name="size" component={Select} options={SIZES} label="Size" />
          <Field
            name="variant"
            component={Select}
            options={VARIANTS}
            label="Variant"
          />
          <Field name="isLoading" component={Checkbox} label="isLoading" />
        </Container>
        <Container style={{ flexGrow: 1 }} vertical>
          <Title text="Result:" />
          <Button {...values}>I'm a button</Button>
        </Container>
      </Container>
    )}
  </Form>
));
