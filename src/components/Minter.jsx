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
  Box,
  useToast,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { Client, Wallet, NFTokenMintFlags, convertStringToHex } from "xrpl";
import { XummSdk } from "xumm-sdk";
import Creating from "./Creating";
import { useRouter } from "next/router";

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
  const [mintSuccess, setMintSuccess] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const temporaryHandleMintNFT = async () => {
    if (!file) {
      console.error("No file selected!");
      return;
    }

    try {
      // Upload the image to IPFS and get the URI
      const imageUri = await uploadImageToIPFS(file);
      console.log("imageUri after upload: ", imageUri);
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
      await temporaryMintNFT(metadataUri);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
  };

  const temporaryMintNFT = async (metadataUri) => {
    setIsCreating(true);
    setMintSuccess(false);
    const client = new Client("wss://s.devnet.rippletest.net:51233/");

    try {
      await client.connect();

      const seed = process.env.NEXT_PUBLIC_XRPL_SECRET; // Your Testnet wallet secret
      const wallet = Wallet.fromSeed(seed);
      const ownerAddress = wallet.classicAddress;
      const nftMintTx = {
        TransactionType: "NFTokenMint",
        Account: ownerAddress,
        URI: convertStringToHex(metadataUri),
        Flags: NFTokenMintFlags.tfBurnable | NFTokenMintFlags.tfOnlyXRP,
        NFTokenTaxon: 0,
      };

      const response = await client.submitAndWait(nftMintTx, { wallet });
      console.log("NFT Minted: ", response);
      setIsCreating(false);
      if (response.result.meta.TransactionResult === "tesSUCCESS") {
        const nftokenId = response.result.meta.nftoken_id;

        toast({
          title: "Minting Successful!",
          description: "Your NFT has been successfully minted.",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          // router.push(`/listing/?tokenID=${nftokenId}&tokenOwner=${ownerAddress}`);
          router.push(
            `/listing/?tokenID=${nftokenId}&tokenOwner=${ownerAddress}`
          );
        }, 1000); // 10000 milliseconds = 10 seconds
      }
    } catch (error) {
      console.error("Error during minting NFT: ", error);
    } finally {
      await client.disconnect();
    }
    setIsCreating(false);
  };

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
      pollForUserAddress(
        payloadId,
        async (userAddress) => {
          // This callback function will be called when the user address is received
          setIsCreating(false); // Hide the loading modal
          console.log("Proceeding with minting...");
          const tokenIdentifier = await mintToken(userAddress); // Assume mintToken is implemented to handle minting
          window.location.href = `/token/${tokenIdentifier}`; // Redirect the user
        },
        (error) => {
          // This callback function will be called on error
          setIsCreating(false); // Hide the loading modal
          console.error("Failed to retrieve user address:", error);
          // Optionally show an error message to the user
        }
      );
    } catch (error) {
      console.error("Failed to mint NFT:", error);
      setIsCreating(false);
    }
  };
  const pollForUserAddress = async (payloadId, onAddressReceived, onError) => {
    try {
      const response = await fetch(`/api/xummHandler?payloadId=${payloadId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.userAddress) {
          console.log("User address received:", data.userAddress);
          onAddressReceived(data.userAddress); // Call the callback function with the user address
        } else {
          console.log("User address not yet available, waiting...");
          setTimeout(
            () => pollForUserAddress(payloadId, onAddressReceived, onError),
            5000
          ); // Poll every 5 seconds
        }
      } else {
        throw new Error("Failed to retrieve user address");
      }
    } catch (error) {
      console.error("Error checking for user address:", error);
      if (typeof onError === "function") {
        onError(error); // Call the error callback function
      }
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
    console.log(
      "image url: ",
      `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`
    );
    return `https://gateway.pinata.cloud/ipfs/${resData.IpfsHash}`;
  };

  const createAndUploadMetadata = async (imageUri, otherMetadata) => {
    const metadata = {
      ...otherMetadata,
      image: imageUri, // Include the image URI in the metadata
    };

    return await uploadToIPFS(metadata); // Reuse the IPFS upload function for the metadata
  };

  // if (!isMobile()) {
  //   return (
  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <ModalOverlay />
  //       <ModalContent>
  //         <ModalHeader>Device Not Supported</ModalHeader>
  //         <ModalBody>
  //           <Text>Please visit this page on a mobile device to mint NFTs.</Text>
  //         </ModalBody>
  //         <ModalFooter>
  //           <Button onClick={onClose}>Close</Button>
  //         </ModalFooter>
  //       </ModalContent>
  //     </Modal>
  //   );
  // }

  return (
    <>
      <Creating isOpen={isCreating} onClose={() => setIsCreating(false)} />
      {mintSuccess && (
        <Box position="fixed" bottom="4" width="full" textAlign="center">
          <Text fontSize="xl" color="green.500">
            NFT Minting Successful!
          </Text>
        </Box>
      )}

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
                onClick={temporaryHandleMintNFT}
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
