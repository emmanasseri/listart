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
  const [creatorAddress, setCreatorAddress] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleMintNFT = async () => {
    if (!file) {
      console.error("No file selected!");
      return;
    }
    setIsCreating(true);
    try {
      // Start the Xumm flow to get the initial user interaction
      const payloadId = await xummFlow();
      if (!payloadId) {
        console.error("Failed to initiate the XUMM flow.");
        setIsCreating(false);
        return;
      }

      console.log(
        "XUMM flow initiated, waiting for user to complete action..."
      );
      const intervalId = setInterval(async () => {
        try {
          const response = await fetch(
            `/api/xummHandler?payloadId=${payloadId}`
          );
          if (response.ok) {
            const { userAddress } = await response.json();
            if (userAddress) {
              clearInterval(intervalId);
              console.log("User address received:", userAddress);
              // Proceed with further actions now that you have the user address
              // Mint here, if this is where you handle minting
              console.log("Proceeding with minting...");
            } else {
              console.log("User address not yet available, waiting...");
            }
          } else {
            throw new Error("Failed to retrieve user address");
          }
        } catch (error) {
          clearInterval(intervalId);
          console.error("Error checking for user address:", error);
        }
      }, 5000); // Poll every 5 seconds
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
  };

  const xummFlow = async () => {
    try {
      const payloadResponse = await fetch("/api/xumm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txjson: { TransactionType: "SignIn" } }),
      });

      const payloadData = await payloadResponse.json();
      console.log("Payload Data:", payloadData); // Log the payload data for reference

      if (payloadResponse.ok && payloadData.uuid) {
        // Redirect user to Xumm for signing
        if (payloadData.next && payloadData.next.always) {
          window.location.href = payloadData.next.always;
        }

        // Return the UUID to indicate the payload creation succeeded

        return payloadData.uuid;
      } else {
        throw new Error("Failed to create payload or retrieve UUID.");
      }
    } catch (error) {
      console.error("Error while getting user address from Xumm:", error);
    }
  };

  const uploadToIPFS = async (jsonData) => {
    const formData = new FormData();
    formData.append(
      "file",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: formData,
    });

    const resData = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
  };

  const uploadImageToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      body: formData,
    });

    const resData = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
  };

  const createAndUploadMetadata = async (imageUri, otherMetadata) => {
    const metadata = {
      ...otherMetadata,
      image: imageUri, // Include the image URI in the metadata
    };

    return await uploadToIPFS(metadata); // Reuse the IPFS upload function for the metadata
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
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="Artist Names (comma separated)"
              value={artists}
              onChange={(e) => setArtists(e.target.value)}
            />
            <Input
              placeholder="Medium"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              placeholder="Cost in XRP"
              type="number"
              value={cost}
              onChange={(e) => setCost(parseFloat(e.target.value))}
            />
            <Input
              placeholder="Royalties (%)"
              type="number"
              value={royalties}
              onChange={(e) => setRoyalties(parseFloat(e.target.value))}
            />
            <Input
              placeholder="Owner’s Contact Information"
              type="email"
              value={ownerContact}
              onChange={(e) => setOwnerContact(e.target.value)}
            />
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="for-sale" mb="0">
                For Sale?
              </FormLabel>
              <Switch
                id="for-sale"
                isChecked={forSale}
                onChange={(e) => setForSale(e.target.checked)}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              isDisabled={!file || !title || !artists}
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
