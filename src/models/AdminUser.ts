import { getDb } from "@/lib/db";
import { WithId, Collection } from "mongodb";
import { z } from "zod";

export const AdminUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;

export type AdminUserEntry = WithId<AdminUser>;

let collectionPromise: Promise<Collection<AdminUserEntry>>;

export const getAdminUsersCollection = async (): Promise<
  Collection<AdminUserEntry>
> => {
  try {
    if (!collectionPromise) {
      collectionPromise = getDb().then((db) =>
        db.collection<AdminUserEntry>("admins")
      );
    }
    return await collectionPromise;
  } catch (error) {
    console.error("Failed to get 'admins' collection:", error);
    throw new Error("Failed to get 'admins' collection");
  }
};

export const getAdminUser = async (username: string) => {
  try {
    const collection = await getAdminUsersCollection();
    const adminUser = collection.findOne({ username });
    return adminUser;
  } catch (error) {
    console.log("Failed to fetch user", error);
    throw new Error("Failed to fetch user");
  }
};
