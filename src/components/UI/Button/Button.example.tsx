import { Title } from 'helpers';

import Form from 'components/UI/Form/Form';
import AssistiveText from 'components/UI/AssistiveText/AssistiveText';
import Container from 'components/UI/Container/Container';
import Checkbox from 'components/UI/Checkbox/Checkbox';
import Select from 'components/UI/Select/Select';
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

export default () => (
  <Form initialValues={INITIAL_PROPS}>
    {({ Field, values }) => (
      <Container style={{ maxWidth: 600 }} centeredH size="l">
        <Container vertical style={{ flexGrow: 1 }} size="s">
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
        <Container style={{ flexGrow: 1 }} vertical size="s">
          <Title text="Result:" />
          <Button {...values}>I'm a button</Button>
        </Container>
      </Container>
    )}
  </Form>
);
