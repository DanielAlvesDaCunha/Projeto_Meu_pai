import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getAdminEmails } from "../src/lib/admin-emails";

const SPECIAL_ADMIN_PASSWORDS: Record<string, string> = {
  "pauloadri2014@gmail.com": "Pau@1945",
};

export async function ensureAdmins(prisma: PrismaClient) {
  const defaultPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  for (const email of getAdminEmails()) {
    const forcedPassword = SPECIAL_ADMIN_PASSWORDS[email];
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: {
          role: "ADMIN",
          ...(forcedPassword
            ? { passwordHash: await bcrypt.hash(forcedPassword, 10) }
            : {}),
        },
      });
      console.log(`Admin ok: ${email}`);
      continue;
    }

    const password = forcedPassword || defaultPassword;
    await prisma.user.create({
      data: {
        name: email === "pauloadri2014@gmail.com" ? "Paulo" : "Administrador",
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "ADMIN",
        phone: process.env.WHATSAPP_LABEL || "",
      },
    });
    console.log(`Admin criado: ${email}`);
  }
}
