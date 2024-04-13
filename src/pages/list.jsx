import React from "react";
import { Box, Text } from "@chakra-ui/react";

const List = () => {
  const checkMetaMaskAndNetwork = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x160c8e2") {
        onOpen();
      } else {
        setShowAddNetworkModal(true); // Wrong network, show modal
      }
    } else {
      setShowAddNetworkModal(true); // MetaMask not installed, show modal
    }
  };
  return (
    <Box p={4} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Text fontSize="xl">List</Text>
      <Button
        colorScheme="blue"
        onClick={checkMetaMaskAndNetwork}
        marginBottom="8"
      >
        Mint NFT
      </Button>
    </Box>
  );
};

export default List;
