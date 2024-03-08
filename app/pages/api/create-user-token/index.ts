import type { NextApiRequest, NextApiResponse } from "next";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query;
  const { metadata = {} } = req.body;
  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE_API_KEY!,
    roomId: roomId as string,
    role: Role.LISTENER,
    options: { metadata: metadata },
    permissions: {
      admin: false,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: false,
    },
  });

  const token = await accessToken.toJwt();

  return res.status(200).json({ token, roomId, metadata });
}
