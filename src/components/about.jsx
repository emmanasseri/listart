import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import Arrow from "./Arrow";

function About() {
  return (
    <VStack spacing={4} textAlign="center" p={5}>
      {" "}
      {/* VStack will stack children vertically with consistent spacing */}
      <Text fontSize={"lg"} fontWeight={"900"}>
        a decentralized marketplace for creators and collectors of physical art.
      </Text>
      <Text>
        With Listart, artists can tokenize and sell their physical artwork.
      </Text>
      <Arrow />
      <Text>
        Anyone interested in buying the artwork can tap their phone to it, which
        will take them to the website with information about the piece.
      </Text>
      <Arrow />
      <Text>
        If the art is for sale, the site will have a request to buy button. When
        they request to buy it, the site will send the request to the artist.
      </Text>
      <Arrow />
      <Text>
        The artist can either approve or deny the sale, and send a message back
        to the buyer.
      </Text>
    </VStack>
  );
}

export default About;
