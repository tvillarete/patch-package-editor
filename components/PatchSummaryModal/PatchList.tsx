import PatchItem from 'components/PatchSummaryModal/PatchItem';
import { PatchDiff } from 'hooks/usePatchParserContext';
import { PatchSelectOption } from 'hooks/usePatchParserContext/sharedTypes';
import { memo, useCallback } from 'react';

interface PatchListProps {
  options: PatchSelectOption[];
  onChange: (options: PatchSelectOption[]) => void;
}

const PatchList = ({ options, onChange }: PatchListProps) => {
  const handleChange = useCallback(
    (updatedOption: PatchSelectOption, val: boolean) => {
      onChange(
        options.map((option) => {
          if (updatedOption.patch.metadata === option.patch.metadata) {
            return { ...option, isSelected: val };
          }

          return option;
        })
      );
    },
    [onChange, options]
  );

  return (
    <div>
      {options.map((option) => (
        <PatchItem
          key={option.patch.metadata}
          option={option}
          onChange={handleChange}
        />
      ))}
    </div>
  );
};

export default memo(PatchList);
