// components/Embedder.jsx
import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";

const Embedder = ({ isOpen, onClose, onEmbed, artworkUrl }) => {
  const handleEmbed = () => {
    // This is where you would integrate the NFC embedding logic.
    // For now, it's just calling the onEmbed prop which should handle the actual NFC writing.
    onEmbed(artworkUrl);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Embed This Work</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text>
              You can embed your link into this work by placing a blank NFC tag
              on the piece. Then, hold your phone close to the blank NFC tag to
              program it with the link to your artwork.
            </Text>
            <Button colorScheme="blue" onClick={handleEmbed}>
              Embed
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Embedder;
