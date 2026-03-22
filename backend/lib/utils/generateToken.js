import jwt from "jsonwebtoken";

const isDev = process.env.NODE_ENV === "development";

export const generateTokenAndSetCookie = (userId, res) => {
	const expiresIn = isDev ? "30d" : "24h";
	const maxAgeMs = isDev ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn,
	});

	res.cookie("jwt", token, {
		maxAge: maxAgeMs,
		httpOnly: true,
		sameSite: "strict",
		secure: process.env.NODE_ENV !== "development",
		path: "/",
	});
};
