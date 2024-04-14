import React from "react";
import { Box, Text, Center, VStack, Button, Link } from "@chakra-ui/react";

const Tap = () => {
  return (
    <Center mt="5vh">
      <VStack spacing={4}>
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
        {/* Button that links to a YouTube video */}
        <Link href="https://www.youtube.com/watch?v=5C2hr5lEy5E" isExternal>
          <Button colorScheme="teal" variant="solid">
            See a Demo
          </Button>
        </Link>
      </VStack>
    </Center>
  );
};

export default Tap;
