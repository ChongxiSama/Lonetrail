import { SITE_ORIGIN } from "@constants/site";
import { type ReactElement, useState } from "react";
import I18nKey from "../../i18n/i18nKey";
import { DEFAULT_LOCALE, type Locale } from "../../i18n/locales";
import { i18n } from "../../i18n/translation";

const PREVIEW_LINES = 120;

function highlightXml(xml: string): string {
	const escaped = xml
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
	return escaped
		.replace(
			/(&lt;\/?)([\w:-]+)([\s\S]*?)(\/?&gt;)/g,
			(_, open: string, tag: string, attrs: string, close: string) => {
				const hlAttrs = attrs.replace(
					/([\w:-]+)=(&quot;(?:[^&]|&(?!quot;))*.?&quot;)/g,
					'<span class="xml-attr">$1</span>=<span class="xml-val">$2</span>',
				);
				return `${open}<span class="xml-tag">${tag}</span>${hlAttrs}${close}`;
			},
		)
		.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="xml-comment">$1</span>');
}

interface SubscribePageProps {
	totalLines: number;
	previewLines: string[];
	lang?: Locale;
}

export default function SubscribePage({
	totalLines,
	previewLines,
	lang = DEFAULT_LOCALE,
}: SubscribePageProps): ReactElement {
	const [copied, setCopied] = useState(false);
	const t = (key: I18nKey) => i18n(key, lang);
	const feedUrl =
		lang === "en" ? `${SITE_ORIGIN}/en/atom.xml` : `${SITE_ORIGIN}/atom.xml`;

	const handleCopy = () => {
		navigator.clipboard.writeText(feedUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const lines = previewLines;

	return (
		<div className="w-full max-w-[840px] mx-auto px-1">
			<div className="bg-page paper-texture mb-8 px-6 md:px-16 py-10 space-y-5 shadow-2xl">
				<div className="flex items-center gap-3">
					<span className="text-[10px] md:text-[11px] font-deco font-semibold text-hint uppercase tracking-[0.2em]">
						Subscribe
					</span>
					<div className="flex-1 h-[1px] bg-hover" />
				</div>

				<h1 className="font-heading text-2xl md:text-4xl text-primary uppercase tracking-tight leading-none">
					{t(I18nKey.subscribeTitle)}
				</h1>

				<p className="font-cn text-[13px] md:text-sm text-hint leading-relaxed max-w-xl">
					{t(I18nKey.subscribeIntro)}
				</p>

				<div className="flex items-stretch gap-2 md:gap-3">
					<div className="flex-1 px-3 md:px-4 py-[9px] md:py-[11px] bg-card border border-border font-mono text-[11px] md:text-[12px] text-primary truncate flex items-center">
						{feedUrl}
					</div>
					<button
						type="button"
						onClick={handleCopy}
						className="shrink-0 px-4 md:px-5 border border-primary font-deco text-[11px] md:text-[12px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-hero hover:text-on-hero transition-colors duration-150"
					>
						{copied ? t(I18nKey.copied) : t(I18nKey.copy)}
					</button>
				</div>

				<div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] md:text-[10px] font-deco text-secondary uppercase tracking-widest">
					<span>● XML / Atom 1.0</span>
					<span>
						● {t(I18nKey.subscribeLines).replace("{count}", String(totalLines))}
					</span>
					<span>● Full Content</span>
				</div>
			</div>

			<div className="relative bg-card paper-texture shadow-2xl">
				<div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-primary" />
				<div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-primary" />
				<div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-primary" />
				<div className="h-10 border-b border bg-page flex items-center justify-between px-4">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-accent" />
						<span className="font-deco text-[11px] text-primary font-bold tracking-wide">
							atom.xml
						</span>
					</div>
					<span className="font-deco text-[9px] text-secondary uppercase tracking-widest">
						{t(I18nKey.subscribeLines).replace("{count}", String(totalLines))}
					</span>
				</div>

				<div className="overflow-auto h-[35vh] md:h-[40vh] min-h-[180px] md:min-h-[200px]">
					<div className="flex">
						<div className="w-12 shrink-0 bg-hover/10 border-r border select-none text-right pr-2 text-[10px] leading-[20px] text-secondary/40 font-mono">
							{lines.map((_, i) => (
								<div key={i}>{i + 1}</div>
							))}
						</div>
						<div className="flex-1 min-w-0">
							{lines.map((line, i) => (
								<div
									key={i}
									className="text-[11px] leading-[20px] text-primary font-mono whitespace-pre-wrap break-all"
									dangerouslySetInnerHTML={{
										__html: highlightXml(line) || "<br/>",
									}}
								/>
							))}
						</div>
					</div>
				</div>

				{totalLines > PREVIEW_LINES && (
					<div className="px-4 py-2.5 border-t border bg-page/80 text-[10px] font-deco text-secondary text-center">
						{t(I18nKey.subscribePreview)
							.replace("{shown}", String(PREVIEW_LINES))
							.replace("{total}", String(totalLines))}
						<a
							href={feedUrl}
							target="_blank"
							className="text-accent hover:underline ml-1"
						>
							{t(I18nKey.subscribeViewFull)}
						</a>
					</div>
				)}

				<div className="h-8 border-t border bg-page flex items-center px-4">
					<div className="flex items-center gap-3 text-[9px] font-deco text-secondary uppercase tracking-widest">
						<span>● Feed</span>
						<span>● UTF-8</span>
						<span>● Read Only</span>
					</div>
				</div>
			</div>

			<div className="mt-4 md:mt-5 text-[9px] md:text-[10px] font-deco text-secondary leading-relaxed tracking-wide px-1">
				<p>{t(I18nKey.subscribeFooter)}</p>
			</div>

			<style>{`
				.xml-tag { color: rgb(var(--ce-accent)); }
				.xml-attr { color: #4B8D9E; }
				.xml-val { color: #C29145; }
				.xml-comment { color: rgb(var(--ce-text-hint)); font-style: italic; }
			`}</style>
		</div>
	);
}
