import React, { useState, useEffect } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import ArtListing from "../components/ArtListing";

const Browse = () => {
  const [artListings, setArtListings] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const data = [
        {
          imageUrl: "https://example.com/art1.jpg",
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
      Browse
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
