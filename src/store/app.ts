import { atom, type WritableAtom } from "nanostores";

export const $isNavMenuOpen: WritableAtom<boolean> = atom(false);
export const $isSearchOpen: WritableAtom<boolean> = atom(false);
export const setIsNavMenuOpen = (val: boolean): void => $isNavMenuOpen.set(val);
export const setIsSearchOpen = (val: boolean): void => $isSearchOpen.set(val);
export const $steamStatus: WritableAtom<{
	text: string;
	active: boolean;
	playing: boolean;
}> = atom({
	text: "—",
	active: false,
	playing: false,
});
export const $spotifyStatus: WritableAtom<{ text: string; active: boolean }> =
	atom({
		text: "—",
		active: false,
	});
