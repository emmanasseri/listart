import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Text } from "@chakra-ui/react";
import ArtListing from "../../components/ArtListing"; // Update the import path as necessary

const ListingPage = () => {
  const router = useRouter();
  const { item } = router.query; // 'item' is assumed to be the NFToken ID or other identifier
  const [nftData, setNftData] = useState(null);

  useEffect(() => {
    const fetchNftData = async () => {
      // This should point to your actual backend API that returns NFT data
      const response = await fetch(`https://api.yoursite.com/nft/${item}`);
      const data = await response.json();
      setNftData(data);
    };

    if (item) {
      fetchNftData();
    }
  }, [item]);

  return (
    <Box padding="5">
      {nftData ? (
        <ArtListing
          imageUrl={nftData.imageUrl}
          title={nftData.title}
          artistNames={nftData.artistNames}
          medium={nftData.medium}
          description={nftData.description}
          cost={nftData.cost}
          owner={nftData.owner}
          royalties={nftData.royalties}
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </Box>
  );
};

export default ListingPage;
