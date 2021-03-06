import Head from "next/head";
import Calculator from "@components/Calculator";
import { ChakraProvider, Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <ChakraProvider>
      <div>
        <Head>
          <title>Calculadora V1</title>
        </Head>
        <Box bg="blue.50" minHeight="100vh">
          <Calculator />
        </Box>
      </div>
    </ChakraProvider>
  );
}
