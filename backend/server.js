import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Base64 görsel istekleri şişirir; 5mb sınırı sıkça 413 / kesik JSON hatasına yol açar
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.use((err, req, res, next) => {
	if (err?.type === "entity.too.large" || err?.status === 413) {
		return res.status(413).json({
			error: "İstek çok büyük. Daha küçük bir görsel seçin veya çözünürlüğü düşürün.",
		});
	}
	console.error("İşlenmeyen hata:", err);
	return res.status(500).json({ error: "Sunucu hatası" });
});

app.listen(PORT, () => {
	console.log(`Sunucu çalışıyor, port: ${PORT}`);
	connectMongoDB();
});
