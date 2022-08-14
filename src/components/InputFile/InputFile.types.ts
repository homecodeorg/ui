import { ChangeEvent, HTMLProps } from 'react';

type ProgressParams = {
  loaded: number;
  total: number;
};
type OnProgress = (args: ProgressParams) => void;
type UploaderParams = {
  file: File;
  fn: OnProgress;
  getXHR?: (xhr: XMLHttpRequest) => void;
};
type Uploader = (UploaderParams) => Promise<string>;

type Value = string[];

export type Props = {
  className?: string;
  label?: string;
  size?: string;
  // Function that uploads the selected file and returns a Promise that
  // resolves with the URL of the uploaded file.
  //
  // It takes three arguments:
  // - file - A File object representing the file to be uploaded.
  // - fn - A callback function that is called with an object containing the loaded and total progress values during the upload process.
  // - getXHR (optional) - A function that is called with an XMLHttpRequest object representing the underlying request. This can be used to set custom headers or other options on the request.
  upload: Uploader;
  // Callback that allows the caller to trigger an upload of selected files.
  // It takes a function as an argument, which should be called with the upload function as its argument.
  // This function can be used to trigger an upload after the user has made their selections.
  uploadOnDemand?: (upload: (fn: Uploader) => Promise<Value>) => void;
  // File types accepted by the component
  accept?: HTMLProps<HTMLInputElement>['accept'];
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
  onChange: (e: ChangeEvent<HTMLInputElement>, value: Value) => void;
  // A function that removes the file from the server.
  // It takes a string representing the name of the file to be removed and returns a Promise that resolves with a boolean value indicating whether the removal was successful or not
  remove?: (fileName: string) => Promise<boolean>;
};
