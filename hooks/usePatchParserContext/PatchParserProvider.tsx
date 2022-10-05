import { createContext, Dispatch, memo, SetStateAction, useState } from 'react';

import { PatchDiff } from './sharedTypes';

export type PatchParserProviderState = {
  patchSections?: PatchDiff[];
  marker?: string;
};

export type PatchParserProviderValue = [
  PatchParserProviderState,
  Dispatch<SetStateAction<PatchParserProviderState>>
];

export const PatchParserContext = createContext<PatchParserProviderValue>([
  {},
  () => {},
]);

export type PatchParserProviderProps = {
  children: React.ReactNode;
  value: PatchParserProviderValue;
};

const PatchParserProvider = ({ children, value }: PatchParserProviderProps) => {
  return (
    <PatchParserContext.Provider value={value}>
      {children}
    </PatchParserContext.Provider>
  );
};

export default memo(PatchParserProvider);
