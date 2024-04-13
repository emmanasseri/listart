import React from "react";
import { Text, Flex, Button, Link } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Flex
      as="footer"
      direction="column"
      align="center"
      justify="center"
      marginTop="8"
      padding="8"
    >
      <Text fontSize="sm" marginBottom="2">
        Made @ HACKKU24
      </Text>
    </Flex>
  );
};
export default Footer;
