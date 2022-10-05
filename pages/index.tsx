import {
  PatchParserProvider,
  PatchParserProviderState,
} from 'hooks/usePatchParserContext';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Container, Spacer, Text } from '@nextui-org/react';

import type { NextPage } from 'next';
import { PatchEditor } from 'components/PatchEditor';

const RootContainer = styled.div`
  padding: 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Home: NextPage = () => {
  const stateHook = useState<PatchParserProviderState>({});
  const [, setState] = stateHook;

  useEffect(() => {
    setState({
      marker:
        window?.localStorage.getItem('patch-package-editor-marker') ??
        undefined,
    });
  }, [setState]);

  return (
    <PatchParserProvider value={stateHook}>
      <RootContainer>
        <Container>
          <Text h1>Patch-package Editor</Text>
          <Text color="primary" h3>
            A visual editor for patch-package files
          </Text>
          <Spacer y={2} />
        </Container>
        <PatchEditor />
      </RootContainer>
    </PatchParserProvider>
  );
};

export default Home;
