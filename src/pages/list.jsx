import React from "react";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
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
    <Box p={4} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Text fontSize="xl">List</Text>
      <Button colorScheme="blue" onClick={handleListArtClick} marginBottom="8">
        List Art
      </Button>
      {/* Conditionally render the Minter Modal */}
      {isMinterOpen && <Minter isOpen={isMinterOpen} onClose={onMinterClose} />}
    </Box>
  );
};

export default List;
