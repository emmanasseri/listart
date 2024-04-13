import React, { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { XRPLEVMProvider } from "@/contexts/XRPL_EVM_context";

const List = () => {
  const [showAddNetworkModal, setShowAddNetworkModal] = useState(false);

  const checkMetaMaskAndNetwork = async () => {
    console.log("Checking MetaMask and network");
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask installed");
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId === "0x160c8e2") {
        console.log("Correct network");
        onOpen();
      } else {
        console.log("Wrong network");
        setShowAddNetworkModal(true); // Wrong network, show modal
      }
    } else {
      console.log("MetaMask not installed");
      setShowAddNetworkModal(true); // MetaMask not installed, show modal
    }
  };
  return (
    <XRPLEVMProvider>
      <Box p={4} maxW="sm" overflow="hidden">
        <Text fontSize="xl">List</Text>
        <Button
          colorScheme="blue"
          onClick={checkMetaMaskAndNetwork}
          marginBottom="8"
        >
          List Art
        </Button>
      </Box>
    </XRPLEVMProvider>
  );
};

export default List;
