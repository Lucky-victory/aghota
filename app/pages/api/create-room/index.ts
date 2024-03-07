import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body;
    const { data } = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      {
        ...body,
        hostWallets: [],
        roomLocked: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.HUDDLE_API_KEY as string,
        },
      }
    );

    res.status(200).json({ ...data.data });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default handler;
