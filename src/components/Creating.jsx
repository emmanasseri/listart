import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Spinner,
  Box,
  Text,
} from "@chakra-ui/react";

const Creating = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="full">
      <ModalOverlay />
      <ModalContent background="transparent" boxShadow="none">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          flexDirection="column"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Text fontSize="xl" marginTop="3" color="white">
            Minting NFT...
          </Text>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default Creating;
