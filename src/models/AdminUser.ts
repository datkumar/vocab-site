import { db } from "@/lib/db";
import { WithId } from "mongodb";
import { z } from "zod";

export const AdminUserSchema = z.object({
  // username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(10),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

export type AdminUserEntry = WithId<AdminUser>;

// MongoDB collection of english word entries
export const AdminUsersCollection = db.collection<AdminUserEntry>("admins");
