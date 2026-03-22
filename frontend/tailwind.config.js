import daisyui from "daisyui";
import daisyUIThemes from "daisyui/src/theming/themes";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {},
	},
	plugins: [daisyui],

	daisyui: {
		themes: [
			"light",
			{
				/* Siyah yerine daha açık gri tonlar; okunabilirlik için base-content açık */
				appGray: {
					...daisyUIThemes["dark"],
					primary: "rgb(29, 155, 240)",
					"primary-content": "#ffffff",
					secondary: "rgb(55, 65, 81)",
					"secondary-content": "#f3f4f6",
					accent: "rgb(71, 85, 105)",
					"accent-content": "#f8fafc",
					neutral: "rgb(75, 85, 99)",
					"neutral-content": "#f3f4f6",
					"base-100": "#6d7484",
					"base-200": "#5f6674",
					"base-300": "#525866",
					"base-content": "#f8fafc",
					info: "rgb(56, 189, 248)",
					success: "rgb(52, 211, 153)",
					warning: "rgb(251, 191, 36)",
					error: "rgb(248, 113, 113)",
				},
			},
		],
	},
};
