"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Center,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { Client, Wallet, NFTokenMintFlags, convertStringToHex } from "xrpl";
import { XummSdk } from "xumm-sdk";

const isMobile = () => {
  // A simple mobile detection, you might want to use a library for a robust solution
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const Minter = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [artists, setArtists] = useState([]);
  const [medium, setMedium] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState(0);
  const [royalties, setRoyalties] = useState(0);
  const [ownerContact, setOwnerContact] = useState("");
  const [forSale, setForSale] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleMintNFT = async () => {
    console.log("handleMintNFT function called"); // Add this line to check function call
    if (!file) {
      console.error("No file selected!");
      return;
    }
    try {
      const userAddress = await getUserAddressFromXumm();
      if (!userAddress) {
        console.error("Failed to get user address from Xumm");
        return;
      }
      console.log("User XRPL Address:", userAddress);
      // Proceed with minting using userAddress...
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
  };

  const getUserAddressFromXumm = async () => {
    try {
      const response = await fetch("/api/xumm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txjson: { TransactionType: "SignIn" },
        }),
      });
      const data = await response.json();
      console.log(data);
      // Redirect user to Xumm for signing
    } catch (error) {
      console.error("Error while getting user address from Xumm:", error);
    }
  };

  if (!isMobile()) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Device Not Supported</ModalHeader>
          <ModalBody>
            <Text>Please visit this page on a mobile device to mint NFTs.</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mint your NFT</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Center
              p={16}
              bg="gray.200"
              borderRadius="md"
              {...getRootProps()}
              cursor="pointer"
            >
              <input {...getInputProps()} />
              {file ? (
                <Text>{file.name}</Text>
              ) : (
                <Text>
                  Drag &apos;n&apos; drop your file here, or click to select
                  files
                </Text>
              )}
            </Center>
            {/* All other input fields */}
            <Button
              colorScheme="blue"
              isDisabled={!file}
              onClick={handleMintNFT}
            >
              Begin Mint
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Minter;
