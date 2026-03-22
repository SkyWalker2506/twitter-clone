/** Cloudinary görsel yükleme için üç env değişkeni de dolu olmalı. */
export function isCloudinaryConfigured() {
	const name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
	const key = process.env.CLOUDINARY_API_KEY?.trim();
	const secret = process.env.CLOUDINARY_API_SECRET?.trim();
	return Boolean(name && key && secret);
}

export const CLOUDINARY_CONFIG_ERROR_TR =
	"Görsel yüklemek için Cloudinary gerekli. .env dosyasında CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ve CLOUDINARY_API_SECRET değerlerini tanımlayın.";
