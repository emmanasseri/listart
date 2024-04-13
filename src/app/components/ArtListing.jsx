import React from "react";
import { Box, Image, Text, Stack, Heading } from "@chakra-ui/react";

const ArtListing = ({
  imageUrl,
  title,
  artistNames,
  medium,
  description,
  cost,
  owner,
  royalties,
}) => {
  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p={5}>
      <Image src={imageUrl} alt={`Image of ${title}`} />

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
            {medium}
          </Box>
        </Box>

        <Heading size="md" my="2">
          {title}
        </Heading>

        <Text fontWeight="bold">Artist(s): {artistNames.join(", ")}</Text>
        <Text mt={1}>{description}</Text>
        <Stack
          mt={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontWeight="bold">${cost}</Text>
          <Text>Owner: {owner}</Text>
        </Stack>
        <Text fontSize="sm">Royalties: {royalties}%</Text>
      </Box>
    </Box>
  );
};

export default ArtListing;
