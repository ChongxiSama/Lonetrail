import type { ReactElement } from "react";
import { profileConfig } from "../../config";
import { DEFAULT_LOCALE, type Locale, localizePath } from "../../i18n/locales";
import { formatDate } from "../../utils/date-utils";

interface CopyrightCardProps {
	title: string;
	published: Date;
	tags: string[];
	slug: string;
	rawBody?: string;
	lang?: Locale;
}

export const CopyrightCard = ({
	title,
	published,
	slug,
	rawBody,
	lang = DEFAULT_LOCALE,
}: CopyrightCardProps): ReactElement => {
	const [year, month, day] = formatDate(published).split("/");
	const dateStr = `${year}.${month}.${day}`;
	const refId = `LT-${year}-${month}${day}-${slug.toUpperCase().slice(0, 6)}`;

	const shareLink = () => {
		navigator.clipboard.writeText(`${title}\n${window.location.href}`);
	};

	const downloadMarkdown = () => {
		if (!rawBody) return;
		const blob = new Blob([rawBody], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${slug}.md`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="relative w-full max-w-[840px] bg-page paper-texture shadow-2xl px-6 md:px-16 py-10 md:py-12 overflow-hidden">
			<div className="absolute -right-6 -bottom-8 opacity-[0.02] select-none pointer-events-none z-0">
				<span className="font-deco text-[150px] md:text-[240px] text-primary uppercase italic font-black leading-none">
					Classified
				</span>
			</div>

			<div className="relative z-10 flex items-center gap-2 mb-6">
				<div className="w-[3px] h-[10px] bg-accent" />
				<span className="text-[10px] font-deco tracking-[0.25em] font-bold text-primary uppercase">
					Distribution Notice
				</span>
				<div className="flex-1 h-px bg-hover/40" />
			</div>

			{/* Title + meta — clean, no outer border */}
			<div className="relative z-10 mb-6">
				<h3 className="font-heading text-[17px] md:text-[19px] text-primary uppercase tracking-tight leading-tight mb-4">
					{title}
				</h3>
				<div className="flex flex-wrap items-center gap-x-5 gap-y-1">
					<span className="font-deco text-[10px] text-secondary uppercase tracking-widest">
						Author{" "}
						<span className="text-primary font-bold ml-1">
							{profileConfig.name}
						</span>
					</span>
					<span className="font-deco text-[10px] text-secondary/40">/</span>
					<span className="font-date text-[11px] text-primary tracking-[0.12em]">
						{dateStr}
					</span>
					<span className="font-deco text-[10px] text-secondary/40">/</span>
					<span className="font-mono text-[10px] text-accent tracking-[0.08em]">
						{refId}
					</span>
				</div>
			</div>

			<div className="relative z-10 border-t border-border/30 pt-5 mb-6">
				<p className="font-cn text-[12px] text-hint leading-relaxed m-0">
					{lang === "en" ? (
						<>
							This work is licensed under{" "}
							<span className="text-primary font-bold">CC BY-NC-SA 4.0</span>.
							Redistribution, remixing and adaptation are allowed for
							non-commercial use, provided the same license is used and the
							original author is credited.
						</>
					) : (
						<>
							本作品采用{" "}
							<span className="text-primary font-bold">CC BY-NC-SA 4.0</span>{" "}
							协议授权。允许分发、混剪、演绎，但不得用于商业用途，且必须基于相同协议分发并标注原作者。
						</>
					)}
				</p>
			</div>

			{/* Actions — compact pill buttons */}
			<div className="relative z-10 flex flex-wrap gap-2">
				<button
					onClick={shareLink}
					className="group highlight-sweep flex items-center gap-2 px-2.5 py-1.5 border border-accent/60 bg-accent/10 hover:border-accent hover:bg-accent/20 transition-all cursor-pointer [&_svg]:text-accent [&_span]:text-accent"
				>
					<svg
						className="w-3 h-3 text-secondary group-hover:text-accent transition-colors"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
						/>
					</svg>
					<span className="font-deco text-[10px] text-primary uppercase tracking-widest group-hover:text-accent transition-colors">
						Share
					</span>
				</button>
				<button
					onClick={downloadMarkdown}
					className="group highlight-sweep flex items-center gap-2 px-2.5 py-1.5 border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer bg-transparent"
				>
					<svg
						className="w-3 h-3 text-secondary group-hover:text-accent transition-colors"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
						/>
					</svg>
					<span className="font-deco text-[10px] text-primary uppercase tracking-widest group-hover:text-accent transition-colors">
						Download
					</span>
				</button>
				<a
					href={localizePath("/subscribe/", lang)}
					className="group highlight-sweep flex items-center gap-2 px-2.5 py-1.5 border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all"
				>
					<svg
						className="w-3 h-3 text-secondary group-hover:text-accent transition-colors"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z"
						/>
					</svg>
					<span className="font-deco text-[10px] text-primary uppercase tracking-widest group-hover:text-accent transition-colors">
						Subscribe
					</span>
				</a>
			</div>
		</div>
	);
};
