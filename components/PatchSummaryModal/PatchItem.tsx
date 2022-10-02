import Editor from '@monaco-editor/react';
import { Card, Checkbox, Spacer, Text } from '@nextui-org/react';

import { PatchSelectOption } from 'hooks/usePatchParserContext/sharedTypes';
import { memo, useCallback } from 'react';

interface PatchItemProps {
  option: PatchSelectOption;
  onChange: (option: PatchSelectOption, isSelected: boolean) => void;
}

const PatchItem = ({ option, onChange }: PatchItemProps) => {
  const handleCheck = useCallback(
    (val: boolean) => {
      onChange(option, val);
    },
    [onChange, option]
  );

  return (
    <Card
      variant="bordered"
      key={option.patch.metadata}
      css={{ marginBottom: 24 }}
    >
      <Card.Header>
        <Checkbox
          size="sm"
          isSelected={option.isSelected}
          onChange={handleCheck}
        >
          <Text b> {option.patch.diffPlus}</Text>
        </Checkbox>
      </Card.Header>
      <Card.Divider />
      <Card.Body>
        <Spacer y={1} />
        <Editor
          theme="vs-dark"
          height={'20vh'}
          defaultLanguage="diff"
          value={option.patch.patchContents.join('\n')}
          options={{
            minimap: {
              enabled: false,
            },
            readOnly: true,
          }}
        />
      </Card.Body>
      <Card.Divider />
    </Card>
  );
};

export default memo(PatchItem);
