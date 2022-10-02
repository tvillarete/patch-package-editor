import * as Fuzz from 'fuzzball';
import { PatchDiff } from 'hooks/usePatchParserContext';
import { PatchSelectOption } from 'hooks/usePatchParserContext/sharedTypes';

type PatchDiffGroupMap = Record<string, PatchSelectOption[]>;

export const groupPatchesByMarker = (options: PatchSelectOption[]) => {
  const groups: PatchDiffGroupMap = {};
  const markers = options.map((option) => option.patch.marker ?? 'Unmarked');
  const seenIndices: Record<string, boolean> = {};

  for (let index = 0; index < options.length; index++) {
    const patchDiff = options[index].patch;

    const { marker } = patchDiff;

    if (!marker || seenIndices[marker]) {
      continue;
    }
    seenIndices[marker] = true;

    const results = Fuzz.extract(marker, markers);

    const filteredResults = results.filter(([_, score]) => score > 80);

    const patchesToAdd = filteredResults.map(([value, , j]) => {
      seenIndices[value] = true;
      return options[j];
    });

    groups[marker] = [...(groups[marker] ?? []), ...patchesToAdd];
  }

  return groups;
};
