import { db } from "@/db";
import { meetings, users } from "@/db/schema";
import {
  HTTP_METHOD_CB,
  errorHandlerCallback,
  mainHandler,
  successHandlerCallback,
} from "@/utils";
import { and, eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return mainHandler(req, res, {
    GET,
    // POST,
  });
}

export const GET: HTTP_METHOD_CB = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { userId, chainId, address } = req.query;
    let where = userId
      ? { where: eq(users.id, parseInt(userId as string)) }
      : {
          where:
            // eq(users.chainId, parseInt(chainId as string)),
            eq(users.address, address as string),
        };
    const user = await db.query.users.findFirst({
      ...where,
    });
    return successHandlerCallback(req, res, {
      message: "user received successfully",
      data: user,
    });
  } catch (error) {
    return errorHandlerCallback(req, res, {
      message: "Something went wrong...",
      data: null,
    });
  }
};
// export const POST: HTTP_METHOD_CB = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   try {
//     const data = req.body;
//     const user = await db.insert(users).values(data);
//     return successHandlerCallback(req, res, {
//       message: "user created successfully",
//       data: user,
//     });
//   } catch (error) {
//     return errorHandlerCallback(req, res, {
//       message: "Something went wrong...",
//       data: null,
//     });
//   }
// };
