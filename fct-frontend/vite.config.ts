import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
// import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		// visualizer({
		// 	filename: "stats.html", // default is 'stats.html' in root
		// 	open: true, // opens browser after build
		// 	gzipSize: true,
		// 	brotliSize: true,
		// }),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
