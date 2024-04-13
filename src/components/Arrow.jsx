import React from "react";
import { Box } from "@chakra-ui/react";
import Image from "next/image";

function Arrow() {
  return (
    <Box
      display="flex" // Use flexbox to center content
      flexDirection="column" // Stack children vertically
      alignItems="center" // Center-align children horizontally
      justifyContent="center" // Center-align children vertically
      height="10vh" // Set a fixed height for the container
      width="auto" // Width automatically adjusts to content
      position="relative" // Use relative for Image component positioning
      p={5}
    >
      <Image
        src="/arrow.png"
        alt="Arrow"
        width={15} // Set image width
        height={15} // Set image height
        layout="intrinsic" // Adjust the layout to respect width and height
      />
    </Box>
  );
}

export default Arrow;
