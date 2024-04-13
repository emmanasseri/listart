import React, { useState } from "react";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import { XRPLEVMProvider } from "@/contexts/XRPL_EVM_context";
import Minter from "@/components/Minter";

const List = () => {
  const {
    isOpen: isMinterOpen,
    onOpen: onMinterOpen,
    onClose: onMinterClose,
  } = useDisclosure();

  const handleListArtClick = async () => {
    if (!isMetaMaskInstalled) {
      alert("Please install MetaMask!");
      return;
    }
    await connectWallet();
    const isOnCorrectNetwork = await checkIsOnXRPLEVMSidechain();
    if (!isOnCorrectNetwork) {
      const userConsent = confirm("Switch to the XRPL EVM Sidechain?");
      if (userConsent) {
        await addXRPLEVMSidechain();
      }
      return;
    }
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
