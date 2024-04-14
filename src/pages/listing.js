import { useRouter } from "next/router";
import ArtListing from "../components/ArtListing";

const ListingPage = () => {
  const router = useRouter();
  const { TID, OWN } = router.query;

  // A slight adjustment to handle both tokenID and tokenOwner check
  if (!TID || !OWN) {
    return <p>Loading...</p>; // Or any other appropriate loading indicator
  }

  return <ArtListing tokenId={TID} tokenOwner={OWN} />;
};

export default ListingPage;
