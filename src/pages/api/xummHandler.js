import axios from "axios";

// In-memory storage for simplicity. Note: This will reset when your server restarts.
const userAddresses = {};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const payloadId = req.body.payloadResponse?.payload_uuidv4;

    if (!payloadId) {
      console.error("Missing payload ID in the request body");
      return res
        .status(400)
        .json({ error: "Missing payload ID in the request body" });
    }

    try {
      const response = await axios.get(
        `https://xumm.app/api/v1/platform/payload/${payloadId}`,
        {
          headers: {
            "X-API-Key": process.env.XUMM_API_KEY,
            "X-API-Secret": process.env.XUMM_API_SECRET,
          },
        }
      );

      if (response.data.response.account) {
        const userAddress = response.data.response.account;
        userAddresses[payloadId] = userAddress;
        console.log(
          `Stored user XRPL Address: ${userAddress} for payload ID: ${payloadId}`
        );
        res.status(200).json({ userAddress, payloadId });
      } else {
        console.error("Payload not resolved or not signed");
        res.status(400).json({ error: "Payload not resolved or not signed" });
      }
    } catch (error) {
      console.error("Error fetching payload details from XUMM:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    // Handle requests to check for a stored user address
    const { payloadId } = req.query;
    console.log("Checking stored address for payload ID:", payloadId);

    if (userAddresses[payloadId]) {
      console.log("User address found:", userAddresses[payloadId]);
      res.status(200).json({ userAddress: userAddresses[payloadId] });
    } else {
      console.log("User address not found for payload ID:", payloadId);
      res.status(404).json({ error: "User address not found" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
