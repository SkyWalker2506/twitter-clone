import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

/** Varsayılan admin yoksa oluşturur (idempotent). */
export async function ensureAdminUser() {
	const username = "Admin";
	const plainPassword = "1234";

	const existing = await User.findOne({ username });
	if (existing) {
		return;
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(plainPassword, salt);

	await User.create({
		fullName: "Administrator",
		username,
		email: "admin@proje-birlik.local",
		password: hashedPassword,
	});

	console.log("Varsayılan admin oluşturuldu: kullanıcı adı Admin, şifre 1234");
}
