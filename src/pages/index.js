"use client";
import Image from "next/image";
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Footer } from "../components/Footer";
import theme from "./theme";
import TypingAnimation from "@/components/TypingAnimation";
import About from "../components/about";

export default function Home() {
  return (
    <>
      <Flex
        align="center" // Align items vertically in the center
        justify="center" // Align items horizontally in the center
      >
        <TypingAnimation />
      </Flex>
      <About />
    </>
  );
}
