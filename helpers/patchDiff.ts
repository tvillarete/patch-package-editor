import * as Fuzz from 'fuzzball';
import { PatchDiff } from 'hooks/usePatchParserContext';
import { PatchSelectOption } from 'hooks/usePatchParserContext/sharedTypes';

type PatchDiffGroupMap = Record<string, PatchSelectOption[]>;

export const groupPatchesByMarker = (options: PatchSelectOption[]) => {
  const groups: PatchDiffGroupMap = {};
  const markers = options.map(
    (option) => option.patch.markerLine ?? 'Unmarked'
  );
  const seenIndices: Record<string, boolean> = {};

  for (let index = 0; index < options.length; index++) {
    const patchDiff = options[index].patch;

    const { markerLine } = patchDiff;

    if (!markerLine || seenIndices[markerLine]) {
      continue;
    }
    seenIndices[markerLine] = true;

    const results = Fuzz.extract(markerLine, markers);

    const filteredResults = results.filter(([_, score]) => score > 80);

    const patchesToAdd = filteredResults.map(([value, , j]) => {
      seenIndices[value] = true;
      return options[j];
    });

    groups[markerLine] = [...(groups[markerLine] ?? []), ...patchesToAdd];
  }

  return groups;
};
