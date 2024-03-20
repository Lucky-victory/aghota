import { type DefaultSession } from "next-auth";

export type APIResponse<T> = {
  data: T | null;
  message?: string;
};
export type USERS = {
  id: number;
  address: string;
  chainId: number;
  fullName?: string | null;
  role: "admin" | "user";
  avatarUrl?: string;
};
export type NEW_USER = Pick<
  USERS,
  "address" | "chainId" | "fullName" | "avatarUrl"
>;
export type MEETINGS = {
  id: number;
  roomId: string;
  title: string;
  userId: number;
  participants?: number;
};
export type MEETING_RECORDS = {
  id: number;
  meetingId?: number;
  roomId: string;
  recordDuration: number;
  userId?: number;
  recordUri: string;
};
export type NEW_MEETING_RECORDS = Pick<
  MEETING_RECORDS,
  "meetingId" | "recordDuration" | "recordUri" | "roomId" | "userId"
>;
export type NEW_MEETING = Pick<MEETINGS, "roomId" | "userId" | "title">;
export type UserSession = DefaultSession & {
  address: string;
  chainId: number;
  user: {
    id: string;
    avatarUrl?: string;
    fullName?: string;
  };
};
