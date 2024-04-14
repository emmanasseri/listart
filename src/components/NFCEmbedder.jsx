import React, { useState } from "react";
import { Button, useToast, VStack, Box, Text } from "@chakra-ui/react";

const NFCEmbedder = ({ nftLink }) => {
  const [nfcStatus, setNfcStatus] = useState("waiting");
  const toast = useToast();

  const writeToNFC = async () => {
    if ("NDEFReader" in window) {
      try {
        setNfcStatus("writing");
        const ndef = new window.NDEFReader();
        await ndef.write({
          records: [{ recordType: "url", data: nftLink }],
        });
        setNfcStatus("success");
        toast({
          title: "Success",
          description: "NFT link has been written to the NFC tag.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error("NFC write failed:", error);
        setNfcStatus("error");
        toast({
          title: "Error",
          description: "Failed to write to the NFC tag.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      setNfcStatus("unsupported");
      toast({
        title: "Unsupported",
        description: "NFC is not supported on this device.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4}>
      <Button
        colorScheme="blue"
        onClick={writeToNFC}
        isLoading={nfcStatus === "writing"}
        loadingText="Writing..."
        disabled={nfcStatus !== "waiting"}
      >
        {nfcStatus === "waiting" ? "Tap NFC Tag to Write" : "Writing..."}
      </Button>
      {nfcStatus === "unsupported" && (
        <Box>
          <Text>NFC is not supported on this device.</Text>
        </Box>
      )}
    </VStack>
  );
};

export default NFCEmbedder;
