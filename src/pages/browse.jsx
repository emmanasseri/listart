import React, { useState, useEffect } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import ArtListing from "../components/ArtListing";

const Browse = () => {
  const [artListings, setArtListings] = useState([]);
  // Example call within the Browse component or wherever needed
  const fetchMetadata = async (ipfsHash) => {
    try {
      const response = await fetch(
        `/api/fetchNFTMetadata?ipfsHash=${ipfsHash}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch metadata.");
      }
      const metadata = await response.json();
      return metadata;
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };
  // Fetching an image blob from the API
  const fetchImage = async (ipfsHash) => {
    try {
      const response = await fetch(
        `/api/fetchNFTMetadata?ipfsHash=${ipfsHash}&contentType=image`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch image.");
      }
      return URL.createObjectURL(await response.blob());
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const data = [
        {
          imageUrl: "/temp_image.png",
          title: "Sunset Boulevard",
          artistNames: ["Alice Johnson", "Bob Smith"],
          medium: "Oil on Canvas",
          description: "A beautiful sunset captured with vibrant colors.",
          cost: "1500",
          owner: "John Doe",
          royalties: "10",
        },
        // Add more objects with similar structure for more art pieces
      ];
      setArtListings(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Browse feature coming soon.
      </Text>
      <SimpleGrid columns={3} spacing={10}>
        {artListings.map((art, index) => (
          <ArtListing
            key={index}
            imageUrl={art.imageUrl}
            title={art.title}
            artistNames={art.artistNames}
            medium={art.medium}
            description={art.description}
            cost={art.cost}
            owner={art.owner}
            royalties={art.royalties}
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Browse;
