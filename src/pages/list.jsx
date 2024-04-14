import React from "react";
import {
  Box,
  Button,
  Text,
  Center,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Minter from "@/components/Minter";

const List = () => {
  const {
    isOpen: isMinterOpen,
    onOpen: onMinterOpen,
    onClose: onMinterClose,
  } = useDisclosure();

  const handleListArtClick = async () => {
    onMinterOpen();
  };

  return (
    <Center h="100vh">
      {" "}
      {/* Centers the content vertically and horizontally */}
      <VStack spacing={4}>
        {" "}
        {/* Vertical Stack for vertical alignment of children */}
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          List Your Work
        </Text>
        <Text textAlign="center">
          Tap the button below to list your first piece of artwork.
        </Text>
        <Button colorScheme="blue" onClick={handleListArtClick} size="lg">
          List Art
        </Button>
        {/* Conditionally render the Minter Modal */}
        {isMinterOpen && (
          <Minter isOpen={isMinterOpen} onClose={onMinterClose} />
        )}
      </VStack>
    </Center>
  );
};

export default List;
