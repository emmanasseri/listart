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
  FormHelperText,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { Client, Wallet, NFTokenMintFlags, convertStringToHex } from "xrpl";

import { XummSdk } from "xumm-sdk";

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

  const mintNFT = async (metadataUri) => {
    // Replace 'wss://s.altnet.rippletest.net/' with the correct WebSocket URL for the XRPL Testnet
    const client = new Client("wss://s.devnet.rippletest.net:51233/");

    try {
      await client.connect();

      const seed = process.env.NEXT_PUBLIC_XRPL_SECRET; // Your Testnet wallet secret
      const wallet = Wallet.fromSeed(seed);

      const nftMintTx = {
        TransactionType: "NFTokenMint",
        Account: wallet.classicAddress,
        URI: convertStringToHex(metadataUri),
        Flags: NFTokenMintFlags.tfBurnable | NFTokenMintFlags.tfOnlyXRP,
        NFTokenTaxon: 0,
      };

      const response = await client.submitAndWait(nftMintTx, { wallet });
      console.log("NFT Minted: ", response);
    } catch (error) {
      console.error("Error during minting NFT: ", error);
    } finally {
      await client.disconnect();
    }
  };

  const handleMintNFT = async () => {
    if (!file) {
      console.error("No file selected!");
      return;
    }

    try {
      // Upload the image to IPFS and get the URI
      const imageUri = await uploadImageToIPFS(file);
      if (!imageUri) {
        console.error("Failed to upload image to IPFS");
        return;
      }

      // Create and upload metadata including the image URI
      const metadataUri = await createAndUploadMetadata(imageUri, {
        title,
        artists: artists.split(", "), // Converts comma-separated string to array
        medium,
        description,
        cost,
        royalties,
        ownerContact,
        forSale,
      });
      if (!metadataUri) {
        console.error("Failed to upload metadata to IPFS");
        return;
      }

      // Mint the NFT on the XRPL using the metadata URI
      await mintNFT(metadataUri);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
  };

  return (
    <>
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
                  <Text textColor={"black"}>
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
    </>
  );
};

export default Minter;
