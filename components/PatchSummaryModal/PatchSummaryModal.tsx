import {
  Badge,
  Button,
  Col,
  Container,
  Grid,
  Modal,
  ModalProps,
  Row,
  Spacer,
  Switch,
  Table,
  Text,
  useModal,
} from '@nextui-org/react';
import PatchList from 'components/PatchSummaryModal/PatchList';
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

  const [shouldShowGrouped, setShouldShowGroup] = useState<boolean>(true);
  const { patchSections: patches = [] } = state;
  const [options, setOptions] = useState<SelectOption[]>([]);

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

    console.log({ newFile });
    navigator.clipboard.writeText(newFile);

    setVisible(false);
  }, [selectedOptions, setVisible]);

  useEffect(() => {
    handleSelectAll();
  }, [handleSelectAll, patches]);

  return (
    <Modal
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
                shadow
                color="primary"
                checked={shouldShowGrouped}
                onChange={(e) => setShouldShowGroup(e.target.checked)}
              />
            </Row>
          </Col>
        </Col>
      </Modal.Header>
      <Modal.Body>
        {shouldShowGrouped ? (
          <GroupedPatchList options={options} onChange={setOptions} />
        ) : (
          <PatchList options={options} onChange={setOptions} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="secondary" onClick={() => setVisible(false)}>
          Cancel
        </Button>
        <Button auto onClick={handleApply}>
          Apply {selectedOptions.length} Patches
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default memo(PatchSummaryModal);
