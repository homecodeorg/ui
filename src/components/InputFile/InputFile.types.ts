import { ChangeEvent, HTMLProps } from 'react';

type ProgressParams = {
  loaded: number;
  total: number;
};
type OnProgress = (args: ProgressParams) => void;
type Uploader = (
  file: File,
  fn: OnProgress,
  getXHR?: (xhr: XMLHttpRequest) => void
) => Promise<string>;

type Value = string[];

export type Props = {
  className?: string;
  label?: string;
  size?: string;
  upload: Uploader;
  uploadOnDemand?: (upload: (fn: Uploader) => Promise<Value>) => void;
  accept?: HTMLProps<HTMLInputElement>['accept'];
  limit?: number; // megabytes
  maxCount?: number; // max files count
  value?: Value; // url
  onSelect?: (files: File[]) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>, value: Value) => void; // upload complete
  remove?: (fileName: string) => Promise<boolean>;
};
