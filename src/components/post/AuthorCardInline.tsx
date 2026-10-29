import { useStore } from "@nanostores/react";
import type { ReactElement } from "react";
import { $spotifyStatus, $steamStatus } from "../../store/app";

function StatusDot({ active }: { active: boolean }) {
	return (
		<span className="relative flex h-2 w-2 shrink-0">
			{active && (
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
			)}
			<span
				className={`relative inline-flex h-2 w-2 rounded-full ${active ? "bg-accent" : "bg-secondary/40"}`}
			/>
		</span>
	);
}

function SteamStatus() {
	const status = useStore($steamStatus);
	return (
		<div className="flex items-center gap-1.5 min-w-0">
			<StatusDot active={status.active} />
			<span className="font-deco text-[9px] text-secondary uppercase tracking-widest shrink-0">
				Steam
			</span>
			<span className="font-deco text-[9px] text-primary uppercase tracking-widest truncate">
				{status.text}
			</span>
		</div>
	);
}

function SpotifyStatus() {
	const status = useStore($spotifyStatus);
	return (
		<div className="flex items-center gap-1.5 min-w-0">
			<StatusDot active={status.active} />
			<span className="font-deco text-[9px] text-secondary uppercase tracking-widest shrink-0">
				Spotify
			</span>
			<span className="font-deco text-[9px] text-primary uppercase tracking-widest truncate">
				{status.text}
			</span>
		</div>
	);
}

export const AuthorCardInline = (): ReactElement => {
	return (
		<div className="flex flex-col gap-1">
			<SteamStatus />
			<SpotifyStatus />
		</div>
	);
};
