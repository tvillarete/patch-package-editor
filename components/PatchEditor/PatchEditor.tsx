import { PatchSummaryModal } from 'components/PatchSummaryModal';
import { usePatchParserContext } from 'hooks/usePatchParserContext';
import { ChangeEvent, memo, useCallback, useState } from 'react';
import styled from 'styled-components';

import Editor from '@monaco-editor/react';
import {
  Button,
  Container,
  FormElement,
  Input,
  Row,
  Spacer,
  Text,
  useModal,
} from '@nextui-org/react';

const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const EditorContainer = styled.div`
  flex: 1.5;
  overflow: hidden;
  min-width: 40vw;
  border-radius: 12px;
`;

const OptionsContainer = styled.div`
  flex: 1;
  margin-left: 24px;
  min-width: 400px;

  @media screen and (max-width: 800px) {
    margin-top: 24px;
    margin-left: 0px;
  }
`;

const PatchEditor = () => {
  const [editorState, setEditorState] = useState<string>();
  const [hasError, setHasError] = useState<boolean>(false);
  const modal = useModal();

  const {
    handleParsePatch,
    handleSetMarker,
    state: { marker },
  } = usePatchParserContext();

  const handleSubmit = useCallback(async () => {
    if (!editorState) {
      return;
    }

    if (marker) {
      localStorage.setItem('patch-package-editor-marker', marker);
    }

    setHasError(false);

    const isParseSuccessful = await handleParsePatch(editorState);

    if (!isParseSuccessful) {
      setHasError(true);
    } else {
      modal.setVisible(true);
    }
  }, [editorState, handleParsePatch, marker, modal]);

  const handleMarkerChange = useCallback(
    (e: ChangeEvent<FormElement>) => {
      handleSetMarker(e.currentTarget.value);
    },
    [handleSetMarker]
  );

  return (
    <Container>
      <ContentContainer>
        <EditorContainer>
          <Editor
            onChange={setEditorState}
            theme="vs-dark"
            height={'40vh'}
            defaultValue="Enter your patch contents here"
            options={{
              minimap: {
                enabled: false,
              },
            }}
          />
        </EditorContainer>
        <OptionsContainer>
          <Text b size={'$2xl'}>
            Options
          </Text>
          <Spacer y={1} />
          <Text b size="$md">
            If you use a unique comment or key to mark patches, add it here and
            the visualizer will group similar markers together.
          </Text>
          <Spacer />
          <Text size="$md">
            Example: <code>{`// @override - Fix TextInput bug`}</code>
          </Text>
          <Spacer />
          <Text size="$md">{`The marker would be "@override", and any other markers that contain "Fix TextInput bug" would be grouped in the visualizer.`}</Text>
          <Spacer y={0.5} />
          <Input
            aria-label="Marker"
            labelLeft="Marker"
            placeholder={`e.g. "@override"`}
            value={marker}
            onChange={handleMarkerChange}
          />
          <Spacer y={0.5} />
        </OptionsContainer>
      </ContentContainer>
      <Spacer y={1} />
      <Row justify="center">
        <Button
          size={'xl'}
          color="gradient"
          disabled={!editorState}
          onPress={handleSubmit}
        >
          Parse file
        </Button>
      </Row>
      {hasError && <Text color="error">Parse unsuccessful</Text>}
      <PatchSummaryModal {...modal} />
    </Container>
  );
};

export default memo(PatchEditor);
