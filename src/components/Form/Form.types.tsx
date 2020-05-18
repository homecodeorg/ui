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

export type Props = {
  className?: string;
  children: (api: FormApi) => JSX.Element | JSX.Element[];
  initialValues: FormValues;
  validationSchema?: FormValidationSchema;
  onFormChange?: (values: FormValues) => void;
  onSubmit: (values: FormValues) => void;
  markEdited?: boolean;
} & Omit<HTMLFormElement, 'contentEditable'>;

export type FieldParams = {
  handleChange: (name: string, val: any) => void;
  handleBlur: (name: string) => void;
  markEdited?: Props['markEdited'];
};
