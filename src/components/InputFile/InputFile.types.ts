import { HTMLProps } from 'react';

import type { Size, FormFieldChangeHandler } from 'uilib/types';

type ProgressParams = {
  loaded: number;
  total: number;
};

type UploaderParams = {
  file: File;
  fn: (ProgressParams) => void;
  getXHR?: (XMLHttpRequest) => void;
};

type Uploader = (UploaderParams) => Promise<string>;

type Accept = HTMLProps<HTMLInputElement>['accept'];

type Value = string[];

export type Props = {
  className?: string;
  label?: string;
  size?: Size;
  variant?: 'default' | 'outlined';
  // Whether the user can drag files to change the order of the list.
  draggable?: boolean;
  // Function that uploads the selected file and returns a Promise that
  // resolves with the URL of the uploaded file.
  //
  // It takes three arguments:
  // - file - A File object representing the file to be uploaded.
  // - fn - A callback function that is called with an object containing the loaded and total progress values during the upload process.
  // - getXHR (optional) - A function that is called with an XMLHttpRequest object representing the underlying request. This can be used to set custom headers or other options on the request.
  upload: Uploader;
  // Callback that allows the caller to trigger an upload of selected files.
  //
  // It takes a function as an argument, which should be called with the upload function as its argument.
  //
  // This function can be used to trigger an upload after the user has made their selections.
  uploadOnDemand?: (Uploader) => void;
  accept?: Accept;
  // Maximum file size allowed in megabytes
  limit?: number;
  // Maximum number of files allowed to be uploaded
  maxCount?: number;
  // URLs of uploaded files
  value?: Value;
  // Callback that is called when the upload is complete.
  // It takes two arguments:
  // - e - ChangeEvent
  // - value - URLs of uploaded files
  onSelect?: (files: File[]) => void;
  // Callback that is called with an array of File objects representing the selected file(s).
  onChange: FormFieldChangeHandler;
  // A function that removes the file from the server.
  // It takes a string representing the name of the file to be removed and returns a Promise that resolves with a boolean value indicating whether the removal was successful or not
  remove?: (fileName: string) => Promise<boolean>;
};
