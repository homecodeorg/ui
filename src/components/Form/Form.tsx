import { Component } from 'react';
import { createStore } from 'justorm/preact';
import cn from 'classnames';
import compare from 'compareq';
import pick from 'lodash.pick';
import omit from 'lodash.omit';

import { clone } from 'tools/object';

import { Input } from 'components/Input/Input';

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

function Field(props) {
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
    children,
    ...controlProps
  } = props;
  const { name, isHidden } = controlProps;

  const valField = typeof value === 'boolean' ? 'checked' : 'value';
  const classes = cn(
    className,
    S.field,
    isHidden && S.hidden,
    isChanged && S.changed
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
      <Control {...controlProps} key={name} />
      {children}
    </div>
  );
}

/**
 * Form
 *
 * @property {Object} initialValues
 * @property {Object} validationSchema
 * @property {JSX} children
 */
export class Form extends Component<T.Props> {
  store;

  field;

  check;

  validationSchema;

  constructor(props) {
    super(props);

    const { defaultValues, initialValues, defaultDisabled } = props;
    const notEmpty = H.getNotEmpty(defaultValues, initialValues);

    this.store = createStore(this, {
      values: { ...initialValues },
      touched: H.getInitialTouched(initialValues),
      errors: {},
      changed: {},
      notEmpty,
      disabled: Object(defaultDisabled),
      isLoading: false,
      isDirty: false,
      isValid: true,
      isEmpty: Object.keys(notEmpty).length === 0,
    });
  }

  field = props => <Field {...this.getFieldProps(props)} />;

  componentDidMount() {
    this.calcChangedAll();
    this.validate();
    this.onInit();
  }

  shouldComponentUpdate({
    initialValues,
    defaultValues,
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

    if (initialValsChanged || defaultValsChanged) {
      this.calcChangedAll(initialValues);
    }

    if (initialValsChanged || validationChanged) {
      this.validate();
    }

    return true;
  }

  getFieldProps(props) {
    const { name } = props;
    const { values, changed, touched, errors } = this.store.originalObject;

    return {
      ...props,
      value: values[name],
      isChanged: changed[name],
      isTouched: touched[name],
      error: errors?.[name],
      handleChange: this.onChange,
      handleBlur: this.onBlur,
    };
  }

  cloneValue(val) {
    if (typeof val === 'object' && val !== null) {
      // date
      if (val?._isAMomentObject) return val.clone();
      // date-range
      if (Object.keys(val).some(key => /^(startDate|endDate)$/.test(key))) {
        return {
          startDate: val.startDate?.clone(),
          endDate: val.endDate?.clone(),
        };
      }

      return clone(val);
    }

    return val;
  }

  setInitialVals(initialValues = {}) {
    this.store.values = Object.entries(initialValues).reduce(
      (acc, [name, val]) => ({ ...acc, [name]: this.cloneValue(val) }),
      {}
    );

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

  getValidationErrors() {
    const { values, disabled } = this.store.originalObject;

    if (!this.validationSchema) return {};

    // @ts-ignore
    const schema = Object.entries(this.validationSchema).reduce(
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
    const defaultValues = this.props.defaultValues || initialValues;
    const { changed, notEmpty } = this.store;

    if (compare(val, initialValues[field])) {
      delete changed[field];
    } else {
      changed[field] = true;
    }

    if (compare(val, defaultValues[field])) {
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
    const defaultValues = this.props.defaultValues || initialValues;
    const { values } = this.store.originalObject;
    const notEmpty = H.getNotEmpty(defaultValues, values);
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
    const errors = this.getValidationErrors();
    const isValid = Object.keys(errors).length === 0;

    Object.assign(this.store, { isValid, errors });
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

  onChange = (field, val) => {
    const { onChange } = this.props;
    const { values, touched } = this.store;

    if (values[field] === val) return;

    const newValues = { ...values.originalObject, [field]: val };

    if (onChange && onChange(newValues) === false) return;

    values[field] = val;
    touched[field] = true;
    this.handleChange(field, val);
  };

  onBlur = name => {
    this.store.touched[name] = true;
  };

  handleChange(field, val) {
    this.calcChanged(field, val);
    this.validate();
  }

  render() {
    const { className, children, ...rest } = this.props;
    const { isLoading } = this.store;
    const classes = cn(S.root, className, isLoading && S.loading);
    const formProps = omit(rest, [
      'defaultValues',
      'defaultDisabled',
      'initialValues',
      'validationSchema',
      'onInit',
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
