import {
	$isNavMenuOpen,
	$isSearchOpen,
	setIsNavMenuOpen,
	setIsSearchOpen,
} from "../store/app";

export function openNav(): void {
	if ($isNavMenuOpen.get()) return;
	setIsNavMenuOpen(true);
}

export function closeNav(): void {
	if (!$isNavMenuOpen.get()) return;
	setIsNavMenuOpen(false);
}

export function openSearch(): void {
	if ($isSearchOpen.get()) return;
	setIsSearchOpen(true);
}

export function closeSearch(): void {
	if (!$isSearchOpen.get()) return;
	setIsSearchOpen(false);
}

export function setCurrentPath(path: string): void {
	const normalized = path.replace(/\/?$/, "/");
	window.dispatchEvent(
		new CustomEvent("path:change", { detail: { path: normalized } }),
	);
}
