import omit from 'lodash.omit';

import { Title } from 'helpers';

import { Container } from 'components/Container/Container';
import { Checkbox } from 'components/Checkbox/Checkbox';
import { Select } from 'components/Select/Select';
import { Form } from 'components/Form/Form';
import { Icon } from 'components/Icon/Icon';

import { Input } from './Input';

const INITIAL_PROPS = {
  size: 'm',
  label: 'Label',
  placeholder: '',
  error: '',
  required: true,
  disabled: false,
  adornmentLeft: null,
  adornmentRight: null,
};

const SIZE_OPTIONS = [
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
];

const ADORNMENT_OPTIONS = [
  { id: 'icon', label: 'Icon' },
  { id: 'text', label: 'Text' },
];

function getAdorment(type, size) {
  if (type === 'text')
    return 'texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttextte';
  if (type === 'icon') return <Icon type="close" size={size} />;
  return null;
}

export default () => (
  <Form initialValues={INITIAL_PROPS}>
    {({ Field, values }) => {
      const { size, adornmentLeft, adornmentRight } = values;

      const props = {
        ...omit(values, ['adornmentLeft', 'adornmentRight']),
        adornmentLeft: getAdorment(adornmentLeft, size),
        adornmentRight: getAdorment(adornmentRight, size),
      };

      return (
        <Container style={{ maxWidth: 600 }} size="l">
          <Container style={{ width: '50%' }} vertical size="s">
            <Title text="Props:" />
            <Field
              name="size"
              component={Select}
              options={SIZE_OPTIONS}
              label="Size"
            />
            <Field name="label" label="Label" />
            <Field name="placeholder" label="Placeholder" />
            <Field
              name="adornmentLeft"
              label="Adornment Left"
              component={Select}
              options={ADORNMENT_OPTIONS}
            />
            <Field
              name="adornmentRight"
              label="Adornment Right"
              component={Select}
              options={ADORNMENT_OPTIONS}
            />
            <Field name="error" label="Error message" />
            <Field name="disabled" component={Checkbox} label="Disabled" />
            <Field name="required" component={Checkbox} label="Required" />
          </Container>
          <Container style={{ width: '50%' }} vertical size="s">
            <Title text="Result:" />
            <Input {...props} defaultValue="Alise" />
          </Container>
        </Container>
      );
    }}
  </Form>
);
