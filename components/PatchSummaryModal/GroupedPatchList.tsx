import { groupPatchesByMarker } from 'helpers/patchDiff';
import { PatchDiff, usePatchParserContext } from 'hooks/usePatchParserContext';
import { memo, useCallback, useMemo } from 'react';

import { Checkbox, Collapse, Text } from '@nextui-org/react';
import pluralize from 'pluralize';
import PatchItem from './PatchItem';
import { PatchSelectOption } from 'hooks/usePatchParserContext/sharedTypes';

interface PatchSummaryProps {
  options: PatchSelectOption[];
  onChange: (options: PatchSelectOption[]) => void;
}

const GroupedPatchList = ({ options, onChange }: PatchSummaryProps) => {
  const patchGroupMap = useMemo(() => groupPatchesByMarker(options), [options]);

  const handleChange = useCallback(
    (groupOptions: PatchSelectOption[], val: boolean) => {
      onChange(
        options.map((option) => {
          if (groupOptions.includes(option)) {
            return { ...option, isSelected: val };
          }
          return option;
        })
      );
    },
    [onChange, options]
  );

  const groupItems = useMemo(
    () =>
      Object.entries(patchGroupMap).map(([marker, patchGroup]) => {
        const isGroupSelected = patchGroup.every((option) => option.isSelected);
        // Show intermediate if at least one is unchecked, but not if all are unchecked.
        const isIntermediate =
          patchGroup.some((option) => !option.isSelected) &&
          !patchGroup.every((option) => !option.isSelected);

        return (
          <Collapse
            key={marker}
            title={
              <Checkbox
                isIndeterminate={isIntermediate}
                isSelected={isGroupSelected}
                onChange={(val) => handleChange(patchGroup, val)}
              >
                <Text b>{marker}</Text>
              </Checkbox>
            }
            subtitle={`${patchGroup.length} ${pluralize(
              'patch',
              patchGroup.length
            )}`}
          >
            {patchGroup.map((option) => (
              <PatchItem
                key={option.patch.metadata}
                option={option}
                onChange={(option, val) => handleChange([option], val)}
              />
            ))}
          </Collapse>
        );
      }),
    [handleChange, patchGroupMap]
  );

  return <Collapse.Group>{groupItems}</Collapse.Group>;
};

export default memo(GroupedPatchList);
