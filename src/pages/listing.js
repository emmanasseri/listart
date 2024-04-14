import { useRouter } from "next/router";
import ArtListing from "../components/ArtListing";

const ListingPage = () => {
  const router = useRouter();
  const { tokenID, tokenOwner } = router.query;

  // A slight adjustment to handle both tokenID and tokenOwner check
  if (!tokenID || !tokenOwner) {
    return <p>Loading...</p>; // Or any other appropriate loading indicator
  }

  return <ArtListing tokenId={tokenID} tokenOwner={tokenOwner} />;
};

export default ListingPage;
