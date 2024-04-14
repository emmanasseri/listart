// src/pages/api/xumm.js
import axios from "axios";

const handler = async (req, res) => {
  console.log("Xumm.js");
  console.log("Webhook received:", req.method, req.body);

  if (req.method === "POST") {
    try {
      const apiResponse = await axios.post(
        "https://xumm.app/api/v1/platform/payload",
        req.body,
        {
          headers: {
            "X-API-Key": process.env.XUMM_API_KEY,
            "X-API-Secret": process.env.XUMM_API_SECRET,
          },
        }
      );

      res.status(200).json(apiResponse.data);
    } catch (error) {
      const errorMessage = error.response ? error.response.data : error.message;
      console.error("Error creating Xumm payload:", errorMessage);
      res.status(error.response ? error.response.status : 500).json({
        error: "Error creating Xumm payload",
        details: errorMessage,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
