export interface DropZoneBaseProps {
  accept: string;
  label: string;
  error?: string | null;
  disabled?: boolean;
  ghost?: boolean;
  id?: string;
  className?: string;
}

export interface DropZoneSingleProps extends DropZoneBaseProps {
  multiple?: false;
  onFile: (file: File) => void;
}

export interface DropZoneMultiProps extends DropZoneBaseProps {
  multiple: true;
  onFiles: (files: File[]) => void;
}

export type Props = DropZoneSingleProps | DropZoneMultiProps;
