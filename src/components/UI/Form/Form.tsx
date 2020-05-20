import { Component } from 'preact';

import cn from 'classnames';
import { bind } from 'decko';
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import compare from 'compareq';
import { createStore } from 'justorm/preact';

import Input from '../Input/Input';

import { Validator } from './Validator';
import S from './Form.styl';
import * as H from './Form.helpers';
import * as T from './Form.types';

function clone(obj) {
  if (!obj) return {};
  return JSON.parse(JSON.stringify(obj));
}

const STORE_FIELDS_EXPOSED = [
  'values',
  'touched',
  'changed',
  'disabled',
  'errors',
  'isValid',
  'isDirty',
  'isLoading',
];

const Field = function Field(props) {
  const {
    value,
    error,
    isChanged,
    isTouched,
    component: Control = Input,
    className,
    onChange,
    onBlur,
    handleChange,
    handleBlur,
    markEdited,
    clearMargins,
    ...controlProps
  } = props;
  const { name, hidden } = controlProps;

  const valField = typeof value === 'boolean' ? 'checked' : 'value';
  const classes = cn(
    className,
    S.field,
    markEdited && isChanged && S.isChanged,
    clearMargins && S.clearMargins,
    hidden && S.isHidden
  );

  function handleFieldChange(e, val) {
    if (onChange && onChange(e, val) === false) return;
    handleChange(name, H.getVal(e, val, valField));
  }

  function handleFieldBlur(e) {
    if (onBlur && onBlur(e) === false) return;
    handleBlur(name);
  }

  Object.assign(controlProps, {
    name,
    [valField]: value,
    onChange: handleFieldChange,
    onBlur: handleFieldBlur,
  });

  if (isTouched && error) controlProps.error = error;

  return <Control className={classes} {...controlProps} key={name} />;
};

class Form extends Component<T.Props> {
  store;

  field;

  check;

  constructor(props) {
    super(props);

    const { initialValues } = props;

    this.store = createStore(this, {
      values: clone(initialValues),
      touched: H.getInitialTouched(initialValues),
      changed: {},
      disabled: {},
      errors: {},
      isValid: true,
      isDirty: false,
      isLoading: false,
    });

    this.setInitialVals(initialValues);

    this.calcChangedAll(initialValues);
    this.validate();
  }

  shouldComponentUpdate({ initialValues, validationSchema }: T.Props) {
    const validationChanged = !compare(
      validationSchema,
      this.props.validationSchema
    );
    const initialValsChanged = !compare(
      initialValues,
      this.props.initialValues
    );

    if (initialValsChanged) {
      this.setInitialVals(initialValues);
    }

    if (initialValsChanged) {
      this.calcChangedAll(initialValues);
    }

    if (initialValsChanged || validationChanged) {
      this.validate();
    }

    return true;
  }

  getFieldProps(props) {
    const { name } = props;
    const { markEdited } = this.props;
    const { values, changed, touched, errors } = this.store;

    return {
      ...props,
      value: values[name],
      isChanged: changed[name],
      isTouched: touched[name],
      error: errors[name],
      handleChange: this.onChange,
      handleBlur: this.onBlur,
      markEdited,
    };
  }

  setInitialVals(initialValues) {
    this.calcChangedAll(initialValues);
    this.field = props => <Field {...this.getFieldProps(props)} />;
  }

  setValue = (field, val) => {
    const { values } = this.store;

    values[field] = val;
    this.calcChanged(field, val);
    this.validate();
  };

  setValues = vals => {
    const { values } = this.store;

    Object.assign(values, clone(vals));
    this.calcChangedAll();
    this.validate();

    return values;
  };

  setDisabled = (name, isDisabled) => {
    const { disabled } = this.store;

    if (isDisabled) {
      disabled[name] = true;
    } else {
      delete disabled[name];
    }
  };

  reset = () => {
    const { initialValues } = this.props;

    this.setValues(initialValues);
    this.store.touched = H.getInitialTouched(initialValues);
  };

  getValidationErrors() {
    const { validationSchema } = this.props;
    const { values, disabled } = this.store;

    if (!validationSchema) return {};

    // @ts-ignore
    const schema = Object.entries(validationSchema).reduce(
      (acc, [field, rule]) => {
        const { type, check } = rule as T.FormValidationRule;

        if (disabled[field]) return acc;

        if (type === 'custom') {
          // NOTE: pass all `values` to custom checker function
          // to allow create validator for dependent fields
          // @ts-ignore
          rule.check = function checkWrap(...args) {
            // @ts-ignore
            return check.call(this, ...args, values);
          };
        }

        return { ...acc, [field]: rule };
      },
      {}
    );

    const res = Validator.validate(values, schema);

    if (typeof res === 'object') return H.patchWithCustomMessages(res, schema);
    return {};
  }

  calcChanged(field, val) {
    const { initialValues } = this.props;
    const { changed } = this.store;

    if (compare(val, initialValues[field])) {
      delete changed[field];
    } else {
      changed[field] = true;
    }

    this.store.isDirty = Object.keys(changed).length > 0;
  }

  calcChangedAll(initialValues = this.props.initialValues) {
    const { values } = this.store;

    if (!values) {
      return;
    }

    this.store.changed = Object.entries(values).reduce(
      (acc, [field, val]) =>
        compare(initialValues[field], val) ? acc : { ...acc, [field]: true },
      {}
    );

    this.store.isDirty = Object.keys(this.store.changed).length > 0;
  }

  validate() {
    const errors = this.getValidationErrors();
    const isValid = Object.keys(errors).length === 0;

    Object.assign(this.store, { isValid, errors });
  }

  @bind
  async onSubmit(e) {
    const { onSubmit } = this.props;
    const { values } = this.store;

    e.preventDefault();
    H.dropFocusFromSubmit();
    this.store.isLoading = true;
    await onSubmit({ ...values });
    this.store.isLoading = false;
  }

  @bind
  onChange(field, val) {
    const { onFormChange } = this.props;
    const { values, touched } = this.store;

    if (values[field] === val) return;

    values[field] = val;
    touched[field] = true;

    this.handleChange(field, val);
    if (onFormChange) onFormChange(values);
  }

  @bind
  onBlur(name) {
    this.store.touched[name] = true;
  }

  handleChange(field, val) {
    this.calcChanged(field, val);
    this.validate();
  }

  render() {
    const { className, children, ...rest } = this.props;
    const { isLoading } = this.store;
    const classes = cn(S.root, className, isLoading && S.isLoading);

    const formProps = omit(rest, [
      'initialValues',
      'validationSchema',
      'onSubmit',
    ]);

    const api = {
      ...pick(this.store, STORE_FIELDS_EXPOSED),
      Field: this.field,
      setValue: this.setValue,
      setValues: this.setValues,
      setDisabled: this.setDisabled,
      reset: this.reset,
    } as T.FormApi;

    return (
      <form onSubmit={this.onSubmit} {...formProps} className={classes}>
        {children(api)}
      </form>
    );
  }
}

export default Form;
