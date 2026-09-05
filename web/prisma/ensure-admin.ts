import { PrismaClient } from "@prisma/client";
import { ensureAdmins } from "./ensure-admins";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("ensure-admin: sem DATABASE_URL, pulando.");
    return;
  }
  const prisma = new PrismaClient();
  try {
    await ensureAdmins(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("ensure-admin falhou:", error);
  process.exit(1);
});
