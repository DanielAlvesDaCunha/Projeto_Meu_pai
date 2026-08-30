import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"];

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return jsonError("Entre de novo na conta admin e tente outra vez.", 401);
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return jsonError("Arquivo inválido", 400);
    }

    const type = file.type || "";
    if (type && !type.startsWith("image/")) {
      return jsonError("Envie uma imagem", 400);
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ALLOWED_EXT.includes(ext) ? (ext === "jpeg" ? "jpg" : ext) : "jpg";
    const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`products/${filename}`, bytes, {
        access: "public",
        contentType: type.startsWith("image/") ? type : "image/jpeg",
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url });
    }

    if (process.env.VERCEL) {
      return jsonError(
        "Falta o armazenamento de fotos (Vercel Blob). Sem isso o upload não funciona no site no ar.",
        503
      );
    }

    const mediaDir = path.join(process.cwd(), "public", "media");
    await mkdir(mediaDir, { recursive: true });
    await writeFile(path.join(mediaDir, filename), bytes);
    return NextResponse.json({ url: `/media/${filename}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha no upload";
    if (/too large|payload|413/i.test(message)) {
      return jsonError("Essa foto é grande demais. Tente outra, um pouco mais leve.", 413);
    }
    return jsonError("Não deu para enviar a foto. Tente de novo em instantes.", 500);
  }
}
