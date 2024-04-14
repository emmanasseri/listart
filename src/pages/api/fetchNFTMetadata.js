// pages/api/fetchNFTMetadata.js
export default async function handler(req, res) {
  const { ipfsHash, contentType } = req.query;

  console.log("Received IPFS hash:", ipfsHash);

  if (!ipfsHash) {
    console.log("IPFS hash not provided in the request.");
    return res.status(400).json({ error: "IPFS hash parameter is missing." });
  }

  try {
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    console.log("Attempting to fetch content from URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, // Ensure your JWT is correctly set
      },
    });

    if (!response.ok) {
      throw new Error(
        `HTTP status ${response.status}: Failed to fetch IPFS data.`
      );
    }

    // Check if the request is for an image or general data
    if (contentType === "image") {
      const imageBlob = await response.blob();
      res.setHeader("Content-Type", imageBlob.type);
      const arrayBuffer = await imageBlob.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } else {
      const data = await response.json();
      console.log("Successfully fetched IPFS data:", data);
      res.status(200).json(data);
    }
  } catch (error) {
    console.error("Error fetching IPFS data:", error);
    res.status(500).json({ message: error.message });
  }
}
