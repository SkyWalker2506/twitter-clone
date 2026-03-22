import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;
		if (!token) {
			return res.status(401).json({ error: "Oturum bulunamadı. Lütfen giriş yapın." });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Geçersiz oturum" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "Kullanıcı bulunamadı" });
		}

		req.user = user;
		next();
	} catch (err) {
		if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
			return res.status(401).json({ error: "Oturum geçersiz veya süresi dolmuş. Lütfen tekrar giriş yapın." });
		}
		console.log("Error in protectRoute middleware", err.message);
		return res.status(500).json({ error: "Sunucu hatası" });
	}
};
