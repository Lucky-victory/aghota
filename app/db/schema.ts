import { relations } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  mysqlEnum,
  primaryKey,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "Users",
  {
    id: int("id").autoincrement().primaryKey(),
    address: varchar("address", { length: 255 }).notNull(),
    chainId: varchar("chainId", { length: 255 }),
    fullName: varchar("fullName", { length: 120 }),
    authId: varchar("authId", { length: 255 }).unique(),
    email: varchar("email", { length: 255 }),
    role: mysqlEnum("role", ["admin", "user"]).default("user"),
    avatarUrl: varchar("avatarUrl", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => ({ pk: primaryKey({ columns: [table.address, table.authId] }) })
);
export const meetingRecords = mysqlTable("MeetingRecords", {
  id: int("id").autoincrement().primaryKey(),
  meetingId: varchar("meetingId", { length: 100 }),
  roomId: varchar("roomId", { length: 255 }),
  authId: varchar("authId", { length: 255 }),
  recordDuration: int("recordDuration"),
  recordUri: varchar("recordUri", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});
export const meetings = mysqlTable("Meetings", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  roomId: varchar("roomId", { length: 100 }).notNull(),
  authId: varchar("authId", { length: 255 }),
  participants: int("participants"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  meeting: many(meetings),
}));
export const meetingRelations = relations(meetings, ({ one, many }) => ({
  records: many(meetingRecords),
  creator: one(users, {
    fields: [meetings.authId],
    references: [users.authId],
  }),
}));
