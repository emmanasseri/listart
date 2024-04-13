"use client";
import Image from "next/image";
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import theme from "../styles/theme";
import TypingAnimation from "@/components/TypingAnimation";
import About from "../components/about";

export default function Home() {
  return (
    <>
      <Flex
        align="center" // Align items vertically in the center
        justify="center" // Align items horizontally in the center
      >
        <Box
          display="flex" // Use flexbox to center content
          alignItems="center" // Center-align children horizontally
          justifyContent="center" // Center-align children vertically
          height="10vh" // Set a fixed height for the container
          width="auto" // Width automatically adjusts to content
          position="relative" // Use relative for Image component positioning
          p={5}
        >
          <TypingAnimation />
        </Box>
      </Flex>
      <About />
    </>
  );
}
