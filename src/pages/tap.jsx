import React from "react";
import { Box, Text, Center, VStack } from "@chakra-ui/react";

const Tap = () => {
  return (
    <Center mt="5vh">
      {" "}
      {/* Centers the content vertically and horizontally */}
      <VStack spacing={4}>
        {" "}
        {/* Vertical Stack for vertical alignment of children */}
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Tap art to buy it
        </Text>
        <Text textAlign="center">
          Each piece listed through the system is unique.
        </Text>
        <Text textAlign="center">
          If it is for sale, it can be purchased by bringing your phone to the
          art.
        </Text>
        <Text textAlign="center" mt="10vh">
          Please always remember to be gentle and respectful of the art!
        </Text>
      </VStack>
    </Center>
  );
};

export default Tap;
