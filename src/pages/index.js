"use client";
import Image from "next/image";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import theme from "./theme";

export default function Home() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" marginTop="4">
        <Heading as="h1" size="2xl" marginBottom="8">
          list art
        </Heading>
        <Heading as="h1" size="2xl" marginBottom="8">
          tap art
        </Heading>
        <Heading as="h1" size="2xl" marginBottom="8">
          buy art
        </Heading>
        <Heading as="h1" size="2xl" marginBottom="8">
          browse art
        </Heading>
        <Box my={4}> {/* Add this Box */}</Box>
      </Box>
      {/* <Footer /> */}
    </ChakraProvider>
  );
}
