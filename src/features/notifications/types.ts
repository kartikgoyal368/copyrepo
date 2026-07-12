import { notifications } from "@/server/db/schema";

export type Notification = typeof notifications.$inferSelect;
