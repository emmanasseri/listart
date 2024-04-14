import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  Stack,
  Heading,
  useToast,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Client, convertHexToString } from "xrpl";
import Embedder from "./Embedder";
import Buy from "./Buy";

const ArtListing = ({ tokenId, tokenOwner }) => {
  const {
    isOpen: isEmbedderOpen,
    onOpen: onEmbedderOpen,
    onClose: onEmbedderClose,
  } = useDisclosure();
  const {
    isOpen: isBuyOpen,
    onOpen: onBuyOpen,
    onClose: onBuyClose,
  } = useDisclosure();

  const [nftData, setNftData] = useState(null);
  const toast = useToast();

  const onEmbed = (artworkUrl) => {
    console.log(`Embedding the artwork URL: ${artworkUrl}`);
    // Here you would invoke the NFC tag writing process using the artwork URL
    // Since this is a mock function, it just logs to the console for now
  };

  const getImageUrl = async (imageUrl) => {
    const tempUrl = new URL(imageUrl);
    const ipfsHash = tempUrl.pathname.split("/ipfs/")[1];
    return `/api/fetchNFTMetadata?ipfsHash=${ipfsHash}&contentType=image`;
  };

  useEffect(() => {
    const fetchNFTData = async () => {
      const client = new Client("wss://s.devnet.rippletest.net:51233/");

      try {
        await client.connect();
        const accountNftsResponse = await client.request({
          command: "account_nfts",
          account: tokenOwner, // Ensure this is the address string, not an object
        });

        const nft = accountNftsResponse.result.account_nfts.find(
          (n) => n.NFTokenID === tokenId
        );
        console.log(nft.URI);

        const metadataUri = convertHexToString(nft.URI);
        const url = new URL(metadataUri);
        const ipfsHash = url.pathname.split("/ipfs/")[1];

        const metadataResponse = await fetch(
          `/api/fetchNFTMetadata?ipfsHash=${ipfsHash}`
        );

        if (!metadataResponse.ok) {
          throw new Error("Failed to fetch NFT metadata from IPFS.");
        }

        const metadata = await metadataResponse.json();
        console.log("ipfshash: ", metadata.image);
        console.log("isEmbedded: ", metadata.isEmbedded);
        const imageUrl = await getImageUrl(metadata.image);

        setNftData({
          imageUrl: imageUrl,
          title: metadata.title,
          artist: metadata.artist,
          medium: metadata.medium,
          description: metadata.description,
          cost: metadata.cost,
          owner: metadata.owner, // This should be updated dynamically if possible
          royalties: metadata.royalties,
          isEmbedded: metadata.isEmbedded,
          forSale: metadata.forSale,
        });
      } catch (error) {
        console.error("Failed to fetch NFT data:", error);
        toast({
          title: "Error fetching NFT",
          description: error.toString(),
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } finally {
        await client.disconnect();
      }
    };

    if (tokenId && tokenOwner) {
      fetchNFTData();
    }
  }, [tokenId, tokenOwner, toast]);

  if (!nftData) {
    return <Text>Loading NFT details...</Text>;
  }
  const handleBuy = () => {
    // Open the Buy modal
    onBuyOpen();
  };

  return (
    <Box
      maxW="sm"
      borderWidth="2px"
      borderRadius="lg"
      overflow="hidden"
      m={7}
      p={5}
    >
      <Flex justifyContent="center">
        <Image src={nftData.imageUrl} alt={`Image of ${nftData.title}`} />
      </Flex>
      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            New
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {nftData.medium}
          </Box>
        </Box>
        <Heading size="md" my="2">
          {nftData.title}
        </Heading>
        <Text fontWeight="bold">{nftData.artist}</Text>
        <Text mt="2">{nftData.description}</Text>
        <Text mt="2">Owned by {nftData.owner}</Text>
        <Stack
          mt="2"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontWeight="bold">${nftData.cost}</Text>
          <Text fontSize="xs">Royalties: {nftData.royalties}%</Text>
        </Stack>
      </Box>
      <Box maxW="sm" overflow="hidden" p={3}>
        <Flex justifyContent="center">
          {nftData && nftData.forSale && (
            <Button colorScheme="green" onClick={handleBuy} mb={4}>
              Buy
            </Button>
          )}
        </Flex>
        <Buy isOpen={isBuyOpen} onClose={onBuyClose} />
      </Box>
      <Box maxW="sm" overflow="hidden">
        <Flex justifyContent="center">
          {!nftData.isEmbedded && (
            <Button colorScheme="blue" onClick={onEmbedderOpen}>
              Embed
            </Button>
          )}
        </Flex>
        <Embedder
          isOpen={isEmbedderOpen}
          onClose={onEmbedderClose}
          onEmbed={onEmbed}
          artworkUrl={window.location.href} // Or any other URL you wish to embed
        />
      </Box>
    </Box>
  );
};

export default ArtListing;
