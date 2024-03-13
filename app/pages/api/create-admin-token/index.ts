import type { NextApiRequest, NextApiResponse } from "next";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { roomId } = req.query;
  const { metadata = {} } = req.body;
  console.log("Here api", { roomId, metadata });

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  const accessToken = new AccessToken({
    apiKey: process.env.HUDDLE_API_KEY!,
    roomId: roomId as string,
    options: { metadata: metadata },
    role: Role.HOST,
    permissions: {
      admin: true,
      canConsume: true,
      canProduce: true,
      canProduceSources: {
        cam: true,
        mic: true,
        screen: true,
      },
      canRecvData: true,
      canSendData: true,
      canUpdateMetadata: true,
    },
  });

  const token = await accessToken.toJwt();

  return res.status(200).json({ token, roomId, metadata });
}
