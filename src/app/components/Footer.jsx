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
        Made @ HACKKU'24
      </Text>
      {/* <Link href="https://kublockchain.com/" isExternal>
        <Button colorScheme="pink" variant="outline" size="sm">
          Learn More
        </Button>
      </Link> */}
    </Flex>
  );
};
export default Footer;
