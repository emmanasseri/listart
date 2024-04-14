// pages/api/fetchNFTMetadata.js

export default async function handler(req, res) {
  const { ipfsHash } = req.query;

  // Log the incoming IPFS hash to ensure it's being received correctly
  console.log("Received IPFS hash:", ipfsHash);

  if (!ipfsHash) {
    console.log("IPFS hash not provided in the request.");
    return res.status(400).json({ error: "IPFS hash parameter is missing." });
  }

  try {
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    console.log("Attempting to fetch metadata from URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, // Make sure your JWT token is correctly set in your environment variables
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP status ${response.status}: Failed to fetch IPFS data.`
      );
    }

    const data = await response.json();
    console.log("Successfully fetched IPFS data:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching IPFS data:", error);
    res.status(500).json({ message: error.message });
  }
}
