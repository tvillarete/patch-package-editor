import * as Fuzz from 'fuzzball';
import { useCallback, useContext, useMemo } from 'react';

import { PatchParserContext } from './PatchParserProvider';
import { PatchDiff } from './sharedTypes';

const parseSection = (section: string) => {
  const lines = section.trim().split('\n');
  const raw = `diff --git${section}`;

  const [
    pathDiffs,
    metadata,
    diffMinus,
    diffPlus,
    lineNumbers,
    ...patchContents
  ] = lines;

  const filePath = diffPlus?.substring(5);

  const marker = patchContents
    ?.find((line) => line.includes('@brex-override'))
    ?.trim();

  const patchDiff: PatchDiff = {
    filePaths: pathDiffs,
    metadata,
    diffMinus,
    diffPlus: filePath,
    lineNumbers,
    patchContents,
    marker,
    raw,
  };

  console.log({ patchDiff });

  if (!patchDiff.diffMinus || !patchDiff.diffPlus) {
    throw new Error('Invalid patch file');
  }

  return patchDiff;
};

const usePatchParserContext = () => {
  const context = useContext(PatchParserContext);
  if (context === undefined) {
    throw new Error(
      'usePatchParserContext must be used within a PatchParserProvider'
    );
  }

  const [state, setState] = context;

  /** Returns true if parse was successful, otherwise false. */
  const handleParsePatch = useCallback(
    async (patchContents: string) => {
      try {
        const patchSections =
          patchContents
            ?.trim()
            .split('diff --git')
            .filter(Boolean)
            .map(parseSection) ?? [];

        setState((prevState) => ({
          ...prevState,
          patchSections,
        }));

        return true;
      } catch {
        setState((prevState) => ({
          ...prevState,
          patchSections: undefined,
        }));

        return false;
      }
    },
    [setState]
  );

  const handleReset = useCallback(() => {
    setState((prevState) => ({
      patchSections: undefined,
    }));
  }, [setState]);

  const returnValue = useMemo(
    () => ({
      handleParsePatch,
      handleReset,
      state,
    }),
    [handleParsePatch, handleReset, state]
  );

  return returnValue;
};

export default usePatchParserContext;
