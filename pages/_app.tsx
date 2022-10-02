import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import {
  PatchParserProvider,
  PatchParserProviderState,
} from 'hooks/usePatchParserContext';
import { useState } from 'react';

const darkTheme = createTheme({
  type: 'dark',
});

function MyApp({ Component, pageProps }: AppProps) {
  const state = useState<PatchParserProviderState>({});

  return (
    <NextUIProvider theme={darkTheme}>
      <PatchParserProvider value={state}>
        <Component {...pageProps} />
      </PatchParserProvider>
    </NextUIProvider>
  );
}

export default MyApp;
