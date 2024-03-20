import { relations } from "drizzle-orm";
import {
  mysqlTable,
  int,
  varchar,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable(
  "Users",
  {
    id: int("id").autoincrement().primaryKey(),
    address: varchar("address", { length: 255 }).notNull(),
    chainId: int("chainId"),
    fullName: varchar("fullName", { length: 120 }),
    email: varchar("email", { length: 255 }),
    role: mysqlEnum("role", ["admin", "user"]).default("user"),
    avatarUrl: varchar("avatarUrl", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (table) => ({ pk: [table.address] })
);
export const meetingRecords = mysqlTable("MeetingRecords", {
  id: int("id").autoincrement().primaryKey(),
  meetingId: varchar("meetingId", { length: 100 }),
  roomId: varchar("roomId", { length: 255 }),
  userId: int("userId").notNull(),
  recordDuration: int("recordDuration"),
  recordUri: varchar("recordUri", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});
export const meetings = mysqlTable("Meetings", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  roomId: varchar("roomId", { length: 100 }).notNull(),
  userId: int("userId").notNull(),
  participants: int("participants"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  meeting: many(meetings),
}));
export const meetingRelations = relations(meetings, ({ one, many }) => ({
  records: many(meetingRecords),
}));
