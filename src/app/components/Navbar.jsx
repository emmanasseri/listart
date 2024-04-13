import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Image, Box } from "@chakra-ui/react";
import styles from "./Navbar.module.css"; // Import the CSS module

const Navbar = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <Link href="/" passHref>
        <Box as="button" bg="transparent" _hover={{ bg: "transparent" }}>
          <Image src="/logo.png" alt="Logo" boxSize="40px" />
        </Box>
      </Link>

      <div className={isDrawerOpen ? styles.drawer : styles.rightMenu}>
        {["list", "tap", "about", "browse"].map((item) => (
          <Link href={`/${item}`} key={item} passHref>
            <Button
              variant="outline"
              colorScheme="whiteAlpha"
              className={styles.drawerItem}
              m={2} // Adding margin around each button
            >
              {item}
            </Button>
          </Link>
        ))}
      </div>

      <div
        className={styles.hamburger}
        onClick={() => setDrawerOpen(!isDrawerOpen)}
      >
        ☰
      </div>
    </nav>
  );
};

export default Navbar;
