import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const DATA_URL_RE = /^data:image\/(png|jpeg|jpg|gif|webp);base64,(.+)$/i;

const MAX_BYTES = 12 * 1024 * 1024; // ~12 MB ham dosya

/**
 * Base64 data URL görselini proje kökündeki uploads/{subfolder} altına yazar.
 * @returns {Promise<string>} Örn. "/uploads/posts/uuid.png"
 */
export async function saveDataUrlToUploads(dataUrl, subfolder = "posts") {
	const m = String(dataUrl).match(DATA_URL_RE);
	if (!m) {
		throw new Error("Geçersiz görsel biçimi (data URL bekleniyor)");
	}
	const extRaw = m[1].toLowerCase();
	const ext = extRaw === "jpeg" ? "jpg" : extRaw;
	const base64 = m[2].replace(/\s/g, "");
	const buf = Buffer.from(base64, "base64");
	if (buf.length > MAX_BYTES) {
		throw new Error("Görsel çok büyük (en fazla ~12 MB)");
	}
	if (buf.length === 0) {
		throw new Error("Boş görsel verisi");
	}

	const dir = path.join(process.cwd(), "uploads", subfolder);
	await fs.mkdir(dir, { recursive: true });
	const name = `${randomUUID()}.${ext}`;
	const filePath = path.join(dir, name);
	await fs.writeFile(filePath, buf);
	return `/uploads/${subfolder}/${name}`;
}

export function isLocalUploadUrl(url) {
	return typeof url === "string" && url.startsWith("/uploads/");
}

export function localFilePathFromUploadUrl(url) {
	if (!isLocalUploadUrl(url)) return null;
	const rel = url.replace(/^\//, "");
	return path.join(process.cwd(), rel);
}

/** Cloudinary yokken veya geliştirmede yerel diske yazma. */
export function useLocalImageUploads() {
	return process.env.NODE_ENV === "development" || process.env.USE_LOCAL_UPLOADS === "true";
}
