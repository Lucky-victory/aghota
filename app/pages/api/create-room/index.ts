import { UserSession } from "@/state/types/index.";
import { AccessToken, Role } from "@huddle01/server-sdk/auth";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import { type DefaultSession, getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getToken({ req });

  try {
    const { userMeta, ...body } = req.body;

    const { data } = await axios.post(
      "https://api.huddle01.com/api/v1/create-room",
      {
        // hostWallets: [session?.sub],
        roomLocked: true,
        ...body,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.HUDDLE_API_KEY as string,
        },
      }
    );
    const roomId = data?.data?.roomId;
    const token = await createTokenForAdmin(roomId, {
      // ...userMeta,
    });
    res.status(200).json({ roomId, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

// when a room is created, create a token for the room creator as admin
export const createTokenForAdmin = async (
  roomId: string,
  metadata: any = {}
) => {
  try {
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
    return token;
  } catch (error) {
    throw error;
  }
};
export default handler;
