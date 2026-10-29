import { useStore } from "@nanostores/react";
import {
	type ReactElement,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import I18nKey from "../../i18n/i18nKey";
import { DEFAULT_LOCALE, type Locale } from "../../i18n/locales";
import { i18n } from "../../i18n/translation";
import { $isSearchOpen, setIsSearchOpen } from "../../store/app";

interface PagefindRawResult {
	id: string;
	score: number;
	words: number;
	data: () => Promise<PagefindResultData>;
}

interface PagefindResultData {
	url: string;
	excerpt: string;
	meta: {
		title: string;
		image?: string;
	};
	sub_results: Array<{
		title: string;
		url: string;
		excerpt: string;
	}>;
}

type PagefindModule = {
	search: (query: string) => Promise<{ results: PagefindRawResult[] }>;
	init: () => Promise<void>;
};

export const SearchPanel = ({
	lang = DEFAULT_LOCALE,
}: {
	lang?: Locale;
}): ReactElement => {
	const t = (key: I18nKey) => i18n(key, lang);
	const isOpen = useStore($isSearchOpen);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<PagefindResultData[]>([]);
	const [loading, setLoading] = useState(false);
	const [ready, setReady] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);
	const pfRef = useRef<PagefindModule | null>(null);
	const loadedRef = useRef(false);
	const searchSeq = useRef(0);

	// Load pagefind module (only in production)
	useEffect(() => {
		if (!isOpen) {
			setQuery("");
			setResults([]);
			return;
		}
		setTimeout(() => inputRef.current?.focus(), 100);

		if (!loadedRef.current && import.meta.env.PROD) {
			loadedRef.current = true;
			const pagefindUrl = "/pagefind/pagefind.js";
			import(/* @vite-ignore */ pagefindUrl)
				.then(async (mod) => {
					await mod.init();
					pfRef.current = mod;
					setReady(true);
				})
				.catch((e) => {
					console.warn("pagefind load error:", e);
					setReady(false);
				});
		} else if (!import.meta.env.PROD) {
			setReady(false);
		}
	}, [isOpen]);

	// Keyboard shortcut
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setIsSearchOpen(!isOpen);
			}
			if (e.key === "Escape" && isOpen) setIsSearchOpen(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isOpen]);

	// Search
	const doSearch = useCallback(
		async (q: string) => {
			if (!q.trim() || !ready || !pfRef.current) {
				setResults([]);
				return;
			}
			const seq = ++searchSeq.current;
			setLoading(true);
			try {
				const { results: raw } = await pfRef.current.search(q);
				if (seq !== searchSeq.current) return;
				const sliced = raw.slice(0, 10);
				const loaded = await Promise.all(sliced.map((r) => r.data()));
				if (seq !== searchSeq.current) return;
				setResults(loaded);
			} catch {
				if (seq === searchSeq.current) setResults([]);
			} finally {
				if (seq === searchSeq.current) setLoading(false);
			}
		},
		[ready],
	);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setQuery(val);
		if (searchTimeout.current) clearTimeout(searchTimeout.current);
		searchTimeout.current = setTimeout(() => doSearch(val), 200);
	};

	const highlight = (excerpt?: string) => {
		if (!excerpt) return "";
		try {
			return excerpt.replace(
				/<mark>(.*?)<\/mark>/g,
				'<span class="text-[#39C5BB] font-bold">$1</span>',
			);
		} catch {
			return "";
		}
	};

	return (
		<>
			<div
				className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => setIsSearchOpen(false)}
			/>

			<div
				className={`fixed inset-x-0 top-0 md:top-[10vh] z-[9999] w-full max-w-2xl md:mx-auto transition-all duration-300 ${
					isOpen
						? "opacity-100 translate-y-0"
						: "opacity-0 -translate-y-4 pointer-events-none"
				}`}
			>
				<div className="bg-hero md:border md:border-white/10 shadow-2xl overflow-hidden mx-0 md:mx-4">
					<div className="flex items-center gap-2 px-4 md:px-6 py-4 md:py-5 border-b border-white/10">
						<svg
							className="w-5 h-5 text-white/30 shrink-0"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.3-4.3" />
						</svg>
						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={handleInput}
							placeholder={t(I18nKey.searchPlaceholder)}
							className="flex-1 bg-transparent border-none outline-none text-white font-cn text-base placeholder:text-white/30 min-w-0"
						/>
						{ready && (
							<span
								className={`hidden md:inline text-[10px] font-deco uppercase tracking-widest shrink-0 ${
									loading ? "text-[#39C5BB]" : "text-white/30"
								}`}
							>
								{loading
									? t(I18nKey.searching)
									: `${results.length} ${t(I18nKey.searchResults)}`}
							</span>
						)}
						<kbd className="hidden md:inline-flex items-center px-2 py-1 text-[10px] font-mono border border-white/20 text-white/30 bg-black/30 shrink-0">
							ESC
						</kbd>
						<button
							type="button"
							aria-label={t(I18nKey.closeSearch)}
							onClick={() => setIsSearchOpen(false)}
							className="md:hidden flex h-[44px] w-[44px] shrink-0 items-center justify-center text-white/40 hover:text-white transition-colors"
						>
							<svg
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 6l12 12M18 6L6 18"
								/>
							</svg>
						</button>
					</div>

					<div className="max-h-[calc(100dvh-64px)] md:max-h-[60vh] overflow-y-auto overscroll-contain">
						{!query.trim() && (
							<div className="px-4 md:px-6 py-8 md:py-12 text-center">
								<div className="flex flex-col items-center gap-3">
									<svg
										className="w-8 h-8 text-white/20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
									>
										<circle cx="11" cy="11" r="8" />
										<path d="m21 21-4.3-4.3" />
									</svg>
									<p className="font-cn text-sm text-white/40">
										{t(I18nKey.searchHint)}
									</p>
									<div className="hidden md:flex items-center gap-2">
										<kbd className="px-2 py-0.5 text-[10px] font-mono border border-white/20 text-white/40 bg-black/30">
											⌘K
										</kbd>
										<span className="font-cn text-[11px] text-white/40">
											{t(I18nKey.searchEmpty)}
										</span>
									</div>
								</div>
							</div>
						)}

						{query.trim() && !loading && results.length === 0 && (
							<div className="px-4 md:px-6 py-8 md:py-12 text-center">
								<p className="font-cn text-sm text-white/40">
									{t(I18nKey.searchNoResults)} &ldquo;{query}&rdquo;
								</p>
							</div>
						)}

						{results.length > 0 && (
							<div className="divide-y divide-white/5">
								{results.map((result, i) => (
									<a
										key={i}
										href={result.url}
										onClick={() => setIsSearchOpen(false)}
										className="highlight-sweep block px-4 md:px-6 py-3 md:py-5 hover:bg-white/5 transition-colors group active:bg-white/10"
									>
										<h3 className="font-heading text-sm md:text-base text-white uppercase tracking-tight font-black group-hover:text-[#39C5BB] transition-colors line-clamp-2 mb-1">
											{result.meta.title}
										</h3>
										<p
											className="font-cn text-[12px] md:text-[13px] text-white/60 leading-relaxed line-clamp-2"
											dangerouslySetInnerHTML={{
												__html: highlight(result.excerpt),
											}}
										/>
									</a>
								))}
							</div>
						)}

						{loading && (
							<div className="px-4 md:px-6 py-8 md:py-12 flex justify-center">
								<div className="flex items-center gap-3">
									<div className="w-1.5 h-1.5 bg-[#39C5BB] rounded-full animate-bounce [animation-delay:0ms]" />
									<div className="w-1.5 h-1.5 bg-[#39C5BB] rounded-full animate-bounce [animation-delay:150ms]" />
									<div className="w-1.5 h-1.5 bg-[#39C5BB] rounded-full animate-bounce [animation-delay:300ms]" />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
