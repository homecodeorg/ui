import { useState, useEffect, useRef, useCallback } from 'react';
import cn from 'classnames';
import compare from 'compareq';

import { Input } from '../Input/Input';

import S from './Form.styl';
import * as H from './Form.helpers';
import * as T from './Form.types';
import { Validator } from './Validator';

const Field = function Field(props: T.FormFieldProps) {
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

  function handleFieldBlur(e: FocusEvent) {
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
};

export function Form(props: T.Props) {
  const {
    className,
    children,
    initialValues = {},
    validationSchema,
    defaultDisabled = {},
    defaultValues,
    markEdited,
    onInit,
    onChange,
    onSubmit,
    ...restProps
  } = props;

  const validationSchemaRef = useRef(validationSchema);
  const defaultValuesRef = useRef<T.FormValues>({});

  // Update default values helper
  const updateDefaultValues = (propsToUse = props) => {
    const { defaultValues: dv, initialValues: iv } = propsToUse;
    return dv || H.cloneValues(iv);
  };

  // Initialize default values
  defaultValuesRef.current = updateDefaultValues();

  // Separate states
  const [values, _setValues] = useState(() => H.cloneValues(initialValues));
  const [touched, _setTouched] = useState(() =>
    H.getInitialTouched(initialValues)
  );
  const [changed, _setChanged] = useState({});
  const [disabled, setDisabled] = useState(() => ({ ...defaultDisabled }));
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [errors, _setErrors] = useState({});
  const [isEmpty, setIsEmpty] = useState(
    () =>
      Object.keys(H.getChanged(defaultValuesRef.current, initialValues))
        .length === 0
  );

  // Refs for stable handlers
  const valuesRef = useRef(values);
  const changedRef = useRef(changed);
  const touchedRef = useRef(touched);
  const errorsRef = useRef(errors);
  const onChangeRef = useRef(onChange);

  const setValues = (newValues: T.FormAPI['values']) => {
    _setValues(newValues);
    valuesRef.current = newValues;
  };

  const setValue = (field: string, val: any) => {
    setValues({ ...valuesRef.current, [field]: val });
  };

  const setErrors = (newErrors: T.FormAPI['errors']) => {
    _setErrors(newErrors);
    errorsRef.current = newErrors;
  };

  const setTouched = (newTouched: T.FormAPI['touched']) => {
    _setTouched(newTouched);
    touchedRef.current = newTouched;
  };

  const setFieldTouched = (field: string, isTouched: boolean) => {
    setTouched({ ...touchedRef.current, [field]: isTouched });
  };

  const setChanged = (newChanged: T.FormAPI['changed']) => {
    _setChanged(newChanged);
    changedRef.current = newChanged;
  };

  // Update refs
  onChangeRef.current = onChange;

  const updateIsDirty = () => {
    const newIsDirty = Object.keys(changedRef.current).length > 0;
    setIsDirty(newIsDirty);
  };

  const updateIsEmpty = () => {
    const newNotEmpty = H.getChanged(
      defaultValuesRef.current,
      valuesRef.current
    );
    setIsEmpty(Object.keys(newNotEmpty).length === 0);
  };

  // Validation functions
  const getValidationErrors = useCallback(
    (valuesData = valuesRef.current, disabledData = disabled) => {
      if (!validationSchemaRef.current) return {};

      const schema = Object.entries(validationSchemaRef.current).reduce(
        (acc, [field, { ...rule }]) => {
          const { type, check } = rule as T.FormValidationRule;

          if (disabledData[field]) return acc;

          if (type === 'custom') {
            rule.check = function checkWrap(...args) {
              return check.call(this, ...args, valuesData);
            };
          }

          return { ...acc, [field]: rule };
        },
        {}
      );

      const res = Validator.validate(valuesData, schema);
      if (typeof res === 'object')
        return H.patchWithCustomMessages(res, schema);
      return {};
    },
    [values, disabled]
  );

  const validate = useCallback(() => {
    const newErrors = getValidationErrors();
    const newIsValid = Object.keys(newErrors).length === 0;

    setErrors(newErrors);
    setIsValid(newIsValid);
  }, [getValidationErrors]);

  const calcChanged = useCallback(
    (field: string, val: any) => {
      const newChanged = { ...changedRef.current };

      if (compare(val, initialValues[field])) {
        delete newChanged[field];
      } else {
        newChanged[field] = true;
      }

      setChanged(newChanged);
      updateIsDirty();
      updateIsEmpty();
    },
    [initialValues]
  );

  const calcChangedAll = (initValues = initialValues) => {
    const newChanged = Object.entries(values).reduce(
      (acc, [field, val]) =>
        compare(initValues[field], val) ? acc : { ...acc, [field]: true },
      {}
    );

    setChanged(newChanged);
    updateIsDirty();
    updateIsEmpty();
  };

  // Form API methods
  const setValueAPI = (field: string, val: any) => {
    setValue(field, val);
    calcChanged(field, val);
    validate();
  };

  const setValuesAPI = vals => {
    const newValues = { ...valuesRef.current, ...vals };
    setValues(newValues);
    calcChangedAll();
    validate();
    return values;
  };

  const setDisabledAPI = useCallback(
    (name: string | object, isDisabledFlag?) => {
      setDisabled(prev => {
        const newDisabled = { ...prev };

        if (typeof name === 'object') {
          Object.assign(newDisabled, name);
        } else if (isDisabledFlag) {
          newDisabled[name] = true;
        } else {
          delete newDisabled[name];
        }

        return newDisabled;
      });
    },
    []
  );

  const reset = useCallback(() => {
    setValues(H.cloneValues(initialValues));
    setTouched({});
    setChanged({});
    updateIsDirty();
    updateIsEmpty();
    validate();
  }, [initialValues]);

  // Event handlers - memoized to prevent field recreation
  const onChangeHandler = useCallback(
    (field: string, val: any) => {
      if (valuesRef.current[field] === val) return;

      const newValues = { ...valuesRef.current, [field]: val };

      if (onChangeRef.current && !onChangeRef.current(newValues)) return;

      setValue(field, val);
      setFieldTouched(field, true);
      calcChanged(field, val);
      validate();
    },
    [calcChanged, validate]
  );

  const onBlurHandler = useCallback((name: string) => {
    setFieldTouched(name, true);
  }, []);

  const onSubmitHandler = async e => {
    e?.preventDefault();
    H.dropFocusFromSubmit();

    if (!onSubmit) return;
    setIsLoading(true);
    await onSubmit({ ...values });
    setIsLoading(false);
  };

  // Simple field component - let memo on Field handle optimization
  const FieldComponent = useRef((fieldProps: T.FieldProps) => {
    const { name } = fieldProps;
    const fullProps: any = {
      ...fieldProps,
      value: valuesRef.current[name],
      error: errorsRef.current[name],
      markEdited,
      isChanged: changedRef.current[name],
      isTouched: touchedRef.current[name],
      handleChange: onChangeHandler,
      handleBlur: onBlurHandler,
    };

    if (validationSchemaRef.current?.[name]?.empty === false) {
      fullProps.required = true;
    }

    return <Field {...fullProps} />;
  });

  const formAPI: T.FormAPI = {
    values,
    touched,
    changed,
    disabled,
    isLoading,
    isDirty,
    isValid,
    isEmpty,
    errors,
    Field: FieldComponent.current,
    setValue: setValueAPI,
    setValues: setValuesAPI,
    setDisabled: setDisabledAPI,
    resetErrors: () => setErrors({}),
    reset,
    submit: onSubmitHandler,
  };

  // Effects
  useEffect(() => {
    validationSchemaRef.current = validationSchema;
  }, [validationSchema]);

  useEffect(() => {
    calcChangedAll();
    validate();
    if (onInit) onInit(formAPI);
  }, []);

  useEffect(() => {
    const validationChanged = !compare(
      validationSchema,
      validationSchemaRef.current
    );
    const initialValsChanged = !compare(initialValues, props.initialValues);
    const defaultValsChanged = !compare(defaultValues, props.defaultValues);

    if (initialValsChanged) {
      setValues(H.cloneValues(initialValues));
      setTouched({});
      setChanged({});
      setIsDirty(false);
      updateIsEmpty();
      validate();
      if (onInit) onInit(formAPI);
    }

    if (defaultValsChanged) {
      defaultValuesRef.current = updateDefaultValues();
    }

    if (initialValsChanged || defaultValsChanged) {
      calcChangedAll(initialValues);
    }

    if (initialValsChanged || validationChanged) {
      validate();
    }
  }, [
    initialValues,
    validationSchema,
    defaultValues,
    onInit,
    formAPI,
    calcChangedAll,
    validate,
  ]);

  const classes = cn(S.root, className, isLoading && S.isLoading);

  return (
    <form className={classes} {...restProps} onSubmit={onSubmitHandler}>
      {children(formAPI)}
    </form>
  );
}

export * from './SubmitButtons/SubmitButtons';
export * as FormTypes from './Form.types';
