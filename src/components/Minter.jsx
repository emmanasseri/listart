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
import { ethers } from "ethers";
//import contractABI from "../../abis/contractABI.json";
import { useXRPLEVM } from "@/contexts/XRPL_EVM_context";

const Minter = ({ isOpen, onClose }) => {
  const {
    isMetaMaskInstalled,
    walletConnected,
    connectWallet,
    checkIsOnXRPLEVMSidechain,
    addXRPLEVMSidechain,
  } = useXRPLEVM();

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

  const handleMint = async () => {
    console.log("Minting NFT");
    // if (!file) {
    //   console.log("No file selected to mint!");
    //   return;
    // }
    // if (!isMetaMaskInstalled) {
    //   console.log("MetaMask is not installed!");
    //   return;
    // }
    // // Check if the user is on the Amoy network
    // if (!checkIsOnXRPLEVMSidechain()) {
    //   console.log("You're not connected to the Amoy network!");
    //   // Prompt user to switch to the Amoy network
    //   await addXRPLEVMSidechain();
    //   return; // Optionally, you could stop the function here or recheck the network
    // }
    // const metadataURI = await uploadToIPFS(file);
    // if (!metadataURI) {
    //   console.log("File upload to IPFS failed");
    //   return;
    // }
    // // Proceed with getting the provider and signer from ethers as you have MetaMask and are connected to Amoy
    // const provider = new ethers.BrowserProvider(window.ethereum);
    // const signer = await provider.getSigner();
    // const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    // const contract = new ethers.Contract(
    //   contractAddress,
    //   contractABI.abi,
    //   signer
    // );
    // try {
    //   const userAddress = await signer.getAddress();
    //   const mintTx = await contract.mintNFT(
    //     userAddress,
    //     metadataURI,
    //     name,
    //     label
    //   );
    //   await mintTx.wait();
    //   console.log("NFT minted! Transaction: ", mintTx.hash);
    //   onClose();
    // } catch (error) {
    //   console.error("Minting failed: ", error);
    // }
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
