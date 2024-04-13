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
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import xrpl from "xrpl";
import { XummSdk } from "xumm-sdk";

console.log("key", process.env.NEXT_PUBLIC_XUMM_API_KEY);
console.log("secret", process.env.NEXT_PUBLIC_XUMM_API_SECRET);
const Sdk = new XummSdk(
  process.env.NEXT_PUBLIC_XUMM_API_KEY,
  process.env.NEXT_PUBLIC_XUMM_API_SECRET
);

const Minter = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [label, setLabel] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const uploadToIPFS = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // No need for fs as we're handling this in the browser environment
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const resData = await res.json();

      // Assuming the file URL is what you need for minting
      return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      return null;
    }
  };

  // const handleMint = async () => {
  //   if (!file) {
  //     console.log("No file selected to mint!");
  //     return;
  //   }
  //   const metadataURI = await uploadToIPFS(file);
  //   if (!metadataURI) {
  //     console.log("File upload to IPFS failed");
  //     return;
  //   }

  //   // Connect to the XRPL Testnet
  //   const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  //   await client.connect();

  //   // Example: Define the wallet and nftokenmint transaction
  //   const wallet = xrpl.Wallet.fromSeed("s...");
  //   const nftMintTx = {
  //     TransactionType: "NFTokenMint",
  //     Account: wallet.address,
  //     URI: xrpl.convertStringToHex(metadataURI),
  //     Flags: xrpl.NFTokenMintFlags.tfBurnable,
  //   };

  //   const response = await client.submitAndWait(nftMintTx, { wallet });
  //   console.log("NFT Minted: ", response);

  //   await client.disconnect();
  //   onClose();
  // };

  const handleMint = async (user, nftDetails) => {
    const payload = {
      txjson: {
        TransactionType: "NFTokenMint",
        Account: user.xrplAccount,
        URI: nftDetails.metadataUri,
        Flags: 8, // Depending on the type of NFT and properties
      },
    };

    try {
      // Create a payload for the user to sign in their Xumm app
      const created = await Sdk.payload.create(payload);

      // Redirect user to sign the transaction in the Xumm app
      // or use a QR code displayed to the user
      console.log(`Please sign the transaction: ${created.next.always}`);

      // Wait for the user to sign the transaction
      const resolved = await Sdk.payload.get(created.payload_uuidv4);

      if (resolved.application && resolved.application.issued_user_token) {
        console.log("NFT Minted Successfully");
      } else {
        console.log("Failed to mint NFT");
      }
    } catch (error) {
      console.error("Error minting NFT: ", error);
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
              <input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: "10px", margin: "10px 0", width: "100%" }}
              />
              <input
                placeholder="Enter a label for the NFT"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                style={{ padding: "10px", margin: "10px 0", width: "100%" }}
              />

              <Button
                colorScheme="blue"
                isDisabled={!file || !name}
                onClick={handleMint}
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
