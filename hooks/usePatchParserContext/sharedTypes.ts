export type PatchDiff = {
  filePaths: string;
  metadata: string;
  diffMinus: string;
  diffPlus: string;
  lineNumbers: string;
  patchContents: string[];
  markerLine?: string;
  raw: string;
};

export type PatchSelectOption = {
  patch: PatchDiff;
  isSelected: boolean;
};
