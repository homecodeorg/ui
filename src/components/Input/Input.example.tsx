import omit from 'lodash.omit';

import { Title, State } from '../../helpers';

import { Container } from '../Container/Container';
import { Checkbox } from '../Checkbox/Checkbox';
import { Select } from '../Select/Select';
import { Form } from '../Form/Form';
import { Icon } from '../Icon/Icon';

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
              key="size"
              label="Size"
              component={Select}
              options={SIZE_OPTIONS}
            />
            <Field name="label" key="label" label="Label" />
            <Field name="placeholder" key="placeholder" label="Placeholder" />
            <Field
              name="adornmentLeft"
              key="adornmentLeft"
              label="Adornment Left"
              component={Select}
              options={ADORNMENT_OPTIONS}
            />
            <Field
              name="adornmentRight"
              key="adornmentRight"
              label="Adornment Right"
              component={Select}
              options={ADORNMENT_OPTIONS}
            />
            <Field name="error" key="error" label="Error message" />
            <Field
              name="disabled"
              key="disabled"
              label="Disabled"
              component={Checkbox}
            />
            <Field
              name="required"
              key="required"
              label="Required"
              component={Checkbox}
            />
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
