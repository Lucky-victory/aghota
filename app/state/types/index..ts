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
  userId: number;
  participants?: number;
};
export type MEETING_RECORDS = {
  id: number;
  meetingId: number;
  recordDuration: number;
  recordUri: string;
};
export type NEW_MEETING_RECORDS = Pick<
  MEETING_RECORDS,
  "meetingId" | "recordDuration" | "recordUri"
>;
export type NEW_MEETING = Pick<MEETINGS, "roomId" | "userId">;
