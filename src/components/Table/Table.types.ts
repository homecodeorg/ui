import { ReactNode } from 'react';
import { ComponentType } from 'uilib/types';

export type Column = {
  // Unique id of the column
  id: string;
  // Label of the column
  label: ReactNode;
  // Whether the column is sticky
  sticky?: boolean;
  // Name of the field in the Data object to render column content.
  //
  // If not specified, the `id` field will be used by default.
  dataField?: string;
  // Function that takes in a Data object and returns a ReactNode representing the content to be displayed in this column for that row.
  //
  // If not specified, the default behavior is to display the value of the corresponding dataField property.
  render?: (itemData: Data) => ReactNode;
};

export type Data = { id: string; className?: string } & any;

export type Props = ComponentType & {
  // Config that describes the structure of the table
  columns: Column[];
  // Actual content of the table
  data: Data[];
  // Whether the table data is in loading state
  isLoading?: boolean;
  // Text to display when the table data is in loading state
  loadingText?: ReactNode;
  // Applies a blur effect to the background
  blur?: boolean;
};
