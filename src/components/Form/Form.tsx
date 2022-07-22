import { Component } from 'react';
import { createStore } from 'justorm/react';
import cn from 'classnames';
import compare from 'compareq';
import pick from 'lodash.pick';
import omit from 'lodash.omit';

import { Input } from '../Input/Input';

import S from './Form.styl';
import * as H from './Form.helpers';
import * as T from './Form.types';
import { Validator } from './Validator';

const STORE_FIELDS_EXPOSED = [
  'isDirty',
  'isEmpty',
  'isValid',
  'isLoading',
  'values',
  'errors',
  'touched',
  'changed',
  'disabled',
];

function Field(props: T.FormFieldProps) {
  const {
    value,
    error,
    markEdited,
    isChanged,
    isTouched,
    clearMargins,
    component: Control = Input,
    className,
    onChange,
    onBlur,
    handleChange,
    handleBlur,
    children,
    ...controlProps
  } = props;
  const { name, isHidden } = controlProps;

  const valField = typeof value === 'boolean' ? 'checked' : 'value';
  const classes = cn(
    className,
    S.field,
    isHidden && S.hidden,
    clearMargins && S.clearMargins,
    markEdited && isChanged && S.changed
  );

  function handleFieldChange(e, val) {
    const v = H.getVal(e, val, valField);
    if (onChange && onChange(e, v) === false) return;
    handleChange(name, v);
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
    error: isTouched && error?.message,
  });

  return (
    <div className={classes}>
      {/* @ts-ignore */}
      <Control {...controlProps} />
      {children}
    </div>
  );
}

export class Form extends Component<T.Props> {
  store: any;

  validationSchema: T.FormValidationSchema;

  defaultValues: T.FormValues = {};

  constructor(props: T.Props) {
    super(props);

    const { initialValues, validationSchema, defaultDisabled } = props;

    this.updateDefaultValues();

    this.validationSchema = validationSchema;

    const values = H.cloneValues(initialValues);
    const notEmpty = H.getNotEmpty(this.defaultValues, initialValues);
    const disabled = Object(defaultDisabled);

    this.store = createStore(this, {
      values,
      touched: H.getInitialTouched(initialValues),
      changed: {},
      notEmpty,
      disabled,
      isLoading: false,
      isDirty: false,
      ...this.getValidationState({ values, disabled }),
      isEmpty: Object.keys(notEmpty).length === 0,
    });
  }

  componentDidMount() {
    this.calcChangedAll();
    this.validate();
    this.onInit();
  }

  shouldComponentUpdate({
    defaultValues,
    initialValues,
    validationSchema,
  }: T.Props) {
    const validationChanged = !compare(
      validationSchema,
      this.props.validationSchema
    );
    const initialValsChanged = !compare(
      initialValues,
      this.props.initialValues
    );
    const defaultValsChanged = !compare(
      defaultValues,
      this.props.defaultValues
    );

    this.validationSchema = validationSchema;

    if (initialValsChanged) {
      this.setInitialVals(initialValues);
    }

    if (defaultValsChanged) this.updateDefaultValues();

    if (initialValsChanged || defaultValsChanged) {
      this.calcChangedAll(initialValues);
    }

    if (initialValsChanged || validationChanged) {
      this.validate();
    }

    return true;
  }

  updateDefaultValues(props = this.props) {
    const { defaultValues, initialValues } = props;

    return defaultValues || H.cloneValues(initialValues);
  }

  setInitialVals(initialValues = {}) {
    this.store.values = H.cloneValues(initialValues);

    this.validate();
    this.onInit();
  }

  setValue = (field, val) => {
    const { values } = this.store;

    values[field] = val;
    this.calcChanged(field, val);
    this.validate();
  };

  setValues = vals => {
    const { values } = this.store;

    Object.assign(values, vals);
    this.calcChangedAll();
    this.validate();

    return values;
  };

  setDisabled = (name: string | object, isDisabled?) => {
    const { disabled } = this.store;

    if (typeof name === 'object') {
      Object.assign(disabled, name);
      return;
    }

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

  field = (props: T.FieldProps) => <Field {...this.getFieldProps(props)} />;

  getFieldProps(props): T.FormFieldProps {
    const { markEdited } = this.props;
    const { name } = props;
    const { values, changed, touched, errors } = this.store.originalObject;
    const fieldProps = {
      ...props,
      value: values[name],
      markEdited,
      isChanged: changed[name],
      isTouched: touched[name],
      error: errors?.[name],
      handleChange: this.onChange,
      handleBlur: this.onBlur,
    };

    if (this.validationSchema?.[name].empty === false)
      fieldProps.required = true;

    return fieldProps;
  }

  getFormAPI(): T.FormApi {
    return {
      ...pick(this.store.originalObject, STORE_FIELDS_EXPOSED),
      Field: this.field,
      setValue: this.setValue,
      setValues: this.setValues,
      setDisabled: this.setDisabled,
      reset: this.reset,
      submit: this.onSubmit,
    };
  }

  getValidationState(store?): T.ValidationState {
    const errors = this.getValidationErrors(store);
    const isValid = Object.keys(errors).length === 0;

    return { isValid, errors };
  }

  getValidationErrors(
    store: T.ValidationStateParams = this.store.originalObject
  ) {
    const { values, disabled } = store;

    if (!this.validationSchema) return {};

    // @ts-ignore
    const schema = Object.entries(this.validationSchema).reduce(
      (acc, [field, { ...rule }]) => {
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

  calcChanged(field: string, val: any) {
    const { initialValues } = this.props;
    const { changed, notEmpty } = this.store;

    if (compare(val, initialValues[field])) {
      delete changed[field];
    } else {
      changed[field] = true;
    }

    if (compare(val, this.defaultValues[field])) {
      delete notEmpty[field];
    } else {
      notEmpty[field] = true;
    }

    Object.assign(this.store, {
      isDirty: Object.keys(changed).length > 0,
      isEmpty: Object.keys(notEmpty).length === 0,
    });
  }

  calcChangedAll(initialValues = this.props.initialValues) {
    const { values } = this.store.originalObject;
    const notEmpty = H.getNotEmpty(this.defaultValues, values);
    const changed = Object.entries(values).reduce(
      (acc, [field, val]) =>
        compare(initialValues[field], val) ? acc : { ...acc, [field]: true },
      {}
    );

    Object.assign(this.store, {
      changed,
      isDirty: Object.keys(changed).length > 0,
      isEmpty: Object.keys(notEmpty).length === 0,
    });
  }

  validate() {
    Object.assign(this.store, this.getValidationState());
  }

  onInit() {
    const { onInit } = this.props;
    if (onInit) onInit(this.getFormAPI());
  }

  onSubmit = async e => {
    const { onSubmit } = this.props;
    const { values } = this.store.originalObject;

    e?.preventDefault();
    H.dropFocusFromSubmit();

    if (!onSubmit) return;
    this.store.isLoading = true;
    await onSubmit({ ...values });
    this.store.isLoading = false;
  };

  onChange = (field: string, val: any) => {
    const { onChange } = this.props;
    const { values, touched } = this.store;

    if (values[field] === val) return;

    const newValues = { ...values.originalObject, [field]: val };

    // @ts-ignore
    if (onChange && onChange(newValues) === false) return;

    values[field] = val;
    touched[field] = true;
    this.handleChange(field, val);
  };

  onBlur = (name: string) => {
    this.store.touched[name] = true;
  };

  handleChange(field: string, val: any) {
    this.calcChanged(field, val);
    this.validate();
  }

  render() {
    const { className, children, ...rest } = this.props;
    const { isLoading } = this.store;
    const classes = cn(S.root, className, isLoading && S.isLoading);
    const formProps = omit(rest, [
      'defaultValues',
      'defaultDisabled',
      'initialValues',
      'validationSchema',
      'onInit',
      'onChange',
      'onSubmit',
    ]);

    return (
      <form className={classes} {...formProps} onSubmit={this.onSubmit}>
        {children(this.getFormAPI())}
      </form>
    );
  }
}

export * from './SubmitButtons/SubmitButtons';
export * as FormTypes from './Form.types';
