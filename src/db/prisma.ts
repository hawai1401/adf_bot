import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client/client.js";
import { withAccelerate } from "@prisma/extension-accelerate";

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter: pool }).$extends(
  withAccelerate()
);
