import PatchItem from 'components/PatchSummaryModal/PatchItem';
import { PatchDiff } from 'hooks/usePatchParserContext';
import { memo } from 'react';

interface PatchListProps {
  patches: PatchDiff[];
}

const PatchList = ({ patches }: PatchListProps) => {
  return (
    <div>
      {patches.map((patchDiff) => (
        <PatchItem key={patchDiff.metadata} diff={patchDiff} />
      ))}
    </div>
  );
};

export default memo(PatchList);
