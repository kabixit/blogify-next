import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <ChakraProvider>
            <CSSReset />
            <Main />
            <NextScript />
          </ChakraProvider>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
