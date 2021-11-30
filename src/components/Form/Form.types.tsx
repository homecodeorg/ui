import { FormHTMLAttributes } from 'react';
import { ValidationSchema } from 'fastest-validator';

export type FormValidationSchema = ValidationSchema;

export type FormValues = { [name: string]: any };

type FieldError = {
  type: string; // error type
  message: string;
  expected?: boolean;
  actual?: boolean;
};

type FieldsFlags = { [name: string]: boolean };

type FieldsErrors = { [name: string]: FieldError };

export type FormApi = {
  isDirty: boolean;
  isValid: boolean;
  isLoading: boolean;
  values: FormValues;
  touched: FieldsFlags;
  changed: FieldsFlags;
  errors: FieldsErrors;
  Field: React.ComponentType;
  setValue: (field: string, val: any) => void;
  setValues: (values: FormValues) => void;
  reset: () => void;
};

export type FormValidationRule = {
  type?: string;
  check?: (
    value: any,
    schema: FormValidationSchema,
    values: FormValues
  ) => boolean;
  messages?: { [id: string]: string };
};

export type Props = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'onChange'
> & {
  className?: string;
  defaultValues?: FormValues;
  defaultDisabled?: FieldsFlags;
  initialValues: FormValues;
  validationSchema?: FormValidationSchema;
  markEdited?: boolean;
  children: (api: FormApi) => JSX.Element | JSX.Element[];
  onInit?: (api: FormApi) => boolean | void;
  onChange?: (values: FormValues) => void;
  onSubmit?: (values: FormValues) => Promise<void>;
};

export type FieldProps = {
  name: string;
  handleChange: (name: string, val: any) => void;
  handleBlur: (name: string) => void;
  markEdited?: Props['markEdited'];
};
