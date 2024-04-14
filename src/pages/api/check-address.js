// src/pages/api/checkAddress.js

const handler = async (req, res) => {
  const { payloadId } = req.query;

  console.log("checkAddress.js");
  console.log("Request received for payload ID:", payloadId);

  if (req.method === "GET") {
    const userAddress = global.userAddresses[payloadId];
    if (userAddress) {
      console.log("User address found for payload ID:", payloadId);
      res.status(200).json({ userAddress });
    } else {
      console.log("No user address found for payload ID:", payloadId);
      res.status(404).json({ error: "User address not found" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
