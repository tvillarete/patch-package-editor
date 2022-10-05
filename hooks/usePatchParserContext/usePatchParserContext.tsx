import { useCallback, useContext, useMemo } from 'react';

import { PatchParserContext } from './PatchParserProvider';
import { PatchDiff } from './sharedTypes';

const parseSection = (section: string, marker?: string) => {
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

  const markerLine = marker
    ? patchContents?.find((line) => line.includes(marker))?.trim()
    : undefined;

  const patchDiff: PatchDiff = {
    filePaths: pathDiffs,
    metadata,
    diffMinus,
    diffPlus: filePath,
    lineNumbers,
    patchContents,
    markerLine,
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
            .map((section) => parseSection(section, state.marker)) ?? [];

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
    [setState, state.marker]
  );

  const handleSetMarker = useCallback(
    (marker?: string) => {
      setState((prevState) => ({
        ...prevState,
        marker,
      }));
    },
    [setState]
  );

  const handleReset = useCallback(() => {
    setState(() => ({
      patchSections: undefined,
    }));
  }, [setState]);

  const returnValue = useMemo(
    () => ({
      handleParsePatch,
      handleReset,
      handleSetMarker,
      state,
    }),
    [handleParsePatch, handleReset, handleSetMarker, state]
  );

  return returnValue;
};

export default usePatchParserContext;
