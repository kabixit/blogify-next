import React from 'react';
import {
  ChakraProvider,
  extendTheme,
  ColorModeScript,
} from '@chakra-ui/react';
import SignUp from './SignUp';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: 'black', // Set the background color for the body
      },
    }),
  },
});


const HomePage = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SignUp />
    </ChakraProvider>
  );
};

export default HomePage;
