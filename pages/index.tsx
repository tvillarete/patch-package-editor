import { PatchSummaryModal } from 'components/PatchSummaryModal';
import { usePatchParserContext } from 'hooks/usePatchParserContext';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

import Editor from '@monaco-editor/react';
import {
  Button,
  Container,
  Row,
  Spacer,
  Text,
  useModal,
} from '@nextui-org/react';

import type { NextPage } from 'next';
const RootContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Home: NextPage = () => {
  const [editorState, setEditorState] = useState<string>();
  const [hasError, setHasError] = useState<boolean>(false);
  const modal = useModal();

  const {
    handleParsePatch,
    state: { patchSections },
  } = usePatchParserContext();

  const handleSubmit = useCallback(async () => {
    if (!editorState) {
      return;
    }

    setHasError(false);

    const isParseSuccessful = await handleParsePatch(editorState);

    if (!isParseSuccessful) {
      setHasError(true);
    } else {
      modal.setVisible(true);
    }
  }, [editorState, handleParsePatch, modal]);

  return (
    <RootContainer>
      <Container>
        <Text h1>Patch-package Editor</Text>
        <Text color="primary" h3>
          A visual editor for patch-package files
        </Text>
        <Spacer y={2} />
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
        <Spacer y={1} />
        <Row justify="center">
          <Button
            size={'xl'}
            color="gradient"
            disabled={!editorState}
            onClick={handleSubmit}
          >
            Parse file
          </Button>
        </Row>
        {hasError && <Text color="error">Parse unsuccessful</Text>}
        <Spacer y={1} />
        <PatchSummaryModal {...modal} />
      </Container>
    </RootContainer>
  );
};

export default Home;
