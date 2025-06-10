import { ReactNode } from 'react';
import { ValidationSchema, ValidationError } from 'fastest-validator';

import type { ComponentType, FormFieldChangeHandler } from 'uilib/types';

export type FormValidationSchema = ValidationSchema;

export type FormValues = Record<string, any>;

type FieldError = {
  type: string; // error type
  message: string;
  expected?: boolean;
  actual?: boolean;
};

type FieldsFlags = Record<string, boolean>;

type FieldsErrors = Record<string, FieldError>;

export type ValidationStateParams = {
  values: FormValues;
  disabled: FieldsFlags;
};

export type ValidationState = {
  // Whether the form is currently valid.
  isValid: boolean;
  // Validation errors for the form fields.
  errors: FieldsErrors;
};

export type FormAPI = ValidationState & {
  // Whether any form field values have changed.
  isDirty: boolean;
  // Whether the form is currently submitting.
  isLoading: boolean;
  // Current form field values
  values: FormValues;
  // Whether each form field has been touched by the user.
  touched: FieldsFlags;
  // Whether each form field value has changed.
  changed: FieldsFlags;
  // Set the value of a specific form field.
  setValue: (field: string, val: any) => void;
  // Set the values of all form fields.
  setValues: (values: FormValues) => void;
  // Reset the form to its initial state.
  reset: () => void;
  // React component used to render individual form fields.
  Field: (props: FormFieldProps) => ReactNode;
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

export type Props = ComponentType & {
  // Default values for the form fields.
  defaultValues?: FormValues;
  // Initial values for the form fields.
  initialValues: FormValues;
  // @deprecated
  defaultDisabled?: FieldsFlags;
  // Schema for validating the form fields.
  // This schema is defined using the [fastest-validator](https://www.npmjs.com/package/fastest-validator) library.
  validationSchema?: FormValidationSchema;
  // Mark fields as edited when they are changed.
  markEdited?: boolean;
  // Render prop function that receives the form API as an argument and returns the form custom layout for the form fields.
  children: (api: FormAPI) => ReactNode | ReactNode[];
  // Called after the form is initialized.
  onInit?: (api: FormAPI) => boolean | void;
  // Called whenever the form values change and receives the current form values as an argument.
  // Return false to prevent the form from changes.
  onChange?: (values: FormValues) => void | boolean;
  // Called when the form is submitted and receives the current form values as an argument
  //
  // It should return a promise that resolves when the submission is complete to properly update isLoading state.
  onSubmit?: (values: FormValues) => Promise<void>;
};

export type FieldProps = {
  // Name of the form field.
  //
  // Used to manage states the form field, such as value, error, touched, changed, etc.
  name: string;
  className?: string;
  onChange: FormFieldChangeHandler;
  // Called when the form field is lost focus.
  //
  // If the function returns false, the field will not be marked as touched.
  onBlur?(e: FocusEvent): boolean | void;
  // Whether to display the dot indicating that the field has been edited.
  markEdited?: Props['markEdited'];
  value: any;
  // Do not render component if true.
  isHidden: boolean;
  // Component used to render the form field.
  component?: (props: FormFieldProps) => ReactNode;
  // Additional content to render below the form field.
  children?: ReactNode;
};

export type FormFieldProps = FieldProps & {
  // Current value.
  value: any;
  // Validation error.
  error: ValidationError;
  // Whether the form field value has changed.
  isChanged: boolean;
  // Whether the form field has been touched by the user.
  isTouched: boolean;
  // Every form field has margin-top to separate it from the previous field.
  //
  // Use clearMargins:false to remove margins from the form field.
  clearMargins: boolean;
  // Called when the form field value changes.
  handleChange: (name: string, val: any) => void;
  // Called when the form field is lost focus.
  handleBlur: (name: string) => void;
};
