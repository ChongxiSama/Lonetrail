export type ThemeMode = "auto" | "light" | "dark";

const THEME_KEY = "theme";

function systemDark(): boolean {
	return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getStoredTheme(): ThemeMode {
	try {
		const raw = localStorage.getItem(THEME_KEY);
		if (raw === "light" || raw === "dark") return raw;
	} catch {
		/* storage unavailable */
	}
	return "auto";
}

export function isDarkMode(mode: ThemeMode): boolean {
	return mode === "dark" || (mode === "auto" && systemDark());
}

export function applyTheme(mode: ThemeMode): void {
	document.documentElement.classList.toggle("dark", isDarkMode(mode));
}

export function setTheme(mode: ThemeMode): void {
	try {
		localStorage.setItem(THEME_KEY, mode);
	} catch {
		/* storage unavailable */
	}
	applyTheme(mode);
}

export function initTheme(): void {
	applyTheme(getStoredTheme());
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => {
			if (getStoredTheme() === "auto") applyTheme("auto");
		});
}
