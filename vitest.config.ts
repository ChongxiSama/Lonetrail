import { fileURLToPath } from "node:url";
import yaml from "@rollup/plugin-yaml";
import { defineConfig } from "vitest/config";

const alias = (path: string): string =>
	fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
	plugins: [yaml()],
	resolve: {
		alias: {
			"@components": alias("./src/components"),
			"@assets": alias("./src/assets"),
			"@constants": alias("./src/constants"),
			"@utils": alias("./src/utils"),
			"@i18n": alias("./src/i18n"),
			"@layouts": alias("./src/layouts"),
			"@": alias("./src"),
		},
	},
	test: {
		environment: "node",
		include: ["tests/**/*.test.ts"],
	},
});
