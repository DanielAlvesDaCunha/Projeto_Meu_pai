const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

export async function prepareImageForUpload(file: File): Promise<File> {
  const type = file.type || "";
  if (type && !type.startsWith("image/")) {
    throw new Error("Envie uma imagem (foto da câmera, jpg ou png).");
  }

  if (typeof createImageBitmap !== "function") {
    return file;
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
  });
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, "") || "foto";
  return new File([blob], `${name}.jpg`, { type: "image/jpeg" });
}

export async function readUploadJson(res: Response): Promise<{ url?: string; error?: string }> {
  const text = await res.text();
  if (!text.trim()) {
    if (res.status === 413) {
      throw new Error("Essa foto é grande demais. Tente outra, um pouco mais leve.");
    }
    if (res.status === 401) {
      throw new Error("Sua sessão admin expirou. Entre de novo e tente outra vez.");
    }
    throw new Error("Não deu para enviar a foto. Tente de novo em instantes.");
  }

  try {
    return JSON.parse(text) as { url?: string; error?: string };
  } catch {
    throw new Error("Não deu para enviar a foto. Tente de novo em instantes.");
  }
}

export async function uploadAdminImage(file: File): Promise<string> {
  const prepared = await prepareImageForUpload(file);
  const body = new FormData();
  body.append("file", prepared);
  const res = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await readUploadJson(res);
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Falha no upload");
  }
  return data.url;
}
