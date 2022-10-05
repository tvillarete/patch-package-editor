import {
  Button,
  Col,
  Modal,
  Popover,
  Row,
  Spacer,
  Switch,
  Text,
  useModal,
} from '@nextui-org/react';
import PatchList from './PatchList';
import { PatchDiff, usePatchParserContext } from 'hooks/usePatchParserContext';
import pluralize from 'pluralize';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import GroupedPatchList from './GroupedPatchList';

interface PatchSummaryModalProps extends ReturnType<typeof useModal> {}

type SelectOption = {
  patch: PatchDiff;
  isSelected: boolean;
};

const PatchSummaryModal = ({
  bindings,
  setVisible,
}: PatchSummaryModalProps) => {
  const { state } = usePatchParserContext();

  const [shouldGroupByMarker, setShouldGroupByMarker] =
    useState<boolean>(false);
  const { patchSections: patches = [] } = state;
  const [options, setOptions] = useState<SelectOption[]>([]);
  const hasMarker = !!state.marker;
  const hasOptions = options.length > 0;

  const selectedOptions = useMemo(
    () => options.filter((option) => option.isSelected),
    [options]
  );

  const handleSelectAll = useCallback(() => {
    setOptions(patches.map((patch) => ({ patch, isSelected: true })));
  }, [patches]);

  const handleApply = useCallback(() => {
    const newFile = selectedOptions
      .map((option) => option.patch.raw)
      .join('\n');

    navigator.clipboard.writeText(newFile);
  }, [selectedOptions]);

  const handleOpen = useCallback(() => {
    handleSelectAll();
    setShouldGroupByMarker(hasOptions && hasMarker);
  }, [handleSelectAll, hasMarker, hasOptions]);

  return (
    <Modal
      onOpen={handleOpen}
      scroll
      width="1000px"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...bindings}
    >
      <Modal.Header>
        <Col>
          <Text id="modal-title" b size={24}>
            {patches.length} {pluralize('patch', patches.length)}
          </Text>
          <Col>
            <Row align="center">
              <Text b>Group by marker</Text>
              <Spacer x={0.5} />
              <Switch
                size="sm"
                color="primary"
                checked={shouldGroupByMarker}
                onChange={(e) => setShouldGroupByMarker(e.target.checked)}
              />
            </Row>
          </Col>
        </Col>
      </Modal.Header>
      <Modal.Body>
        {shouldGroupByMarker ? (
          <GroupedPatchList options={options} onChange={setOptions} />
        ) : (
          <PatchList options={options} onChange={setOptions} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button auto bordered color="default" onPress={() => setVisible(false)}>
          Close
        </Button>
        <Popover isBordered placement="top">
          <Popover.Trigger>
            <Button
              color="gradient"
              disabled={!selectedOptions.length}
              auto
              ripple={false}
              onPress={handleApply}
            >
              Copy {selectedOptions.length}{' '}
              {pluralize('patch', selectedOptions.length)}
            </Button>
          </Popover.Trigger>
          <Popover.Content>
            <Text css={{ padding: '10px' }}>
              New patch contents have been copied to your clipboard
            </Text>
          </Popover.Content>
        </Popover>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(PatchSummaryModal);
