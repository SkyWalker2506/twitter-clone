export const formatPostDate = (createdAt) => {
	if (!createdAt) return "";
	const currentDate = new Date();
	const createdAtDate = new Date(createdAt);
	if (Number.isNaN(createdAtDate.getTime())) return "";

	const timeDifferenceInSeconds = Math.floor((currentDate - createdAtDate) / 1000);
	const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);
	const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);
	const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

	if (timeDifferenceInDays > 1) {
		return createdAtDate.toLocaleDateString("tr-TR", { month: "short", day: "numeric" });
	} else if (timeDifferenceInDays === 1) {
		return "1 gün";
	} else if (timeDifferenceInHours >= 1) {
		return `${timeDifferenceInHours} sa`;
	} else if (timeDifferenceInMinutes >= 1) {
		return `${timeDifferenceInMinutes} dk`;
	} else {
		return "Az önce";
	}
};

export const formatMemberSinceDate = (createdAt) => {
	if (!createdAt) return "";
	const date = new Date(createdAt);
	if (Number.isNaN(date.getTime())) return "";
	const formatted = date.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
	return `Katılım ${formatted}`;
};
