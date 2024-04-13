import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Flex,
  IconButton,
  Button,
  Image,
  useBreakpointValue,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Flex
      as="nav"
      align="center"
      justify="flex-end" // Ensure everything aligns to the end
      wrap="wrap"
      padding="1rem"
      bg="transparent"
      color="white"
      w="100%"
    >
      <Flex align="center" ml="auto" mr={5}>
        <Link href="/" passHref>
          <Image src="/logo.png" alt="Logo" boxSize="40px" />
        </Link>
      </Flex>

      {isMobile ? (
        <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
          <IconButton
            icon={<HamburgerIcon />}
            variant="outline"
            aria-label="Open Menu"
            size="lg"
          />
        </Box>
      ) : (
        <Box
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          flexGrow={1}
        >
          {["list", "tap", "about", "browse"].map((item) => (
            <Link href={`/${item}`} key={item} passHref>
              <Button variant="outline" m={2} _hover={{ bg: "whiteAlpha.300" }}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Button>
            </Link>
          ))}
        </Box>
      )}

      {isOpen && (
        <Box pb={4} display={{ md: "none" }}>
          <MenuList>
            {["list", "tap", "about", "browse"].map((item) => (
              <MenuItem key={item} onClick={() => setIsOpen(false)}>
                <Link href={`/${item}`} passHref>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              </MenuItem>
            ))}
          </MenuList>
        </Box>
      )}
    </Flex>
  );
};

export default Navbar;
