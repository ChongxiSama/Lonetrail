import { isInternalDomain } from "../constants/site";

let ecCopyInitialized = false;

export class PageLifecycle {
	private static ensureJsdelivrPreconnect() {
		if (
			document.querySelector(
				'link[href="https://cdn.jsdelivr.net"][rel="preconnect"]',
			)
		)
			return;
		const preconnect = document.createElement("link");
		preconnect.rel = "preconnect";
		preconnect.href = "https://cdn.jsdelivr.net";
		preconnect.crossOrigin = "";
		document.head.appendChild(preconnect);
		const dnsPrefetch = document.createElement("link");
		dnsPrefetch.rel = "dns-prefetch";
		dnsPrefetch.href = "https://cdn.jsdelivr.net";
		document.head.appendChild(dnsPrefetch);
	}
	private static lazyLoadAssets() {
		if (
			document.querySelector(".katex") &&
			!document.querySelector('link[href*="katex"]')
		) {
			PageLifecycle.ensureJsdelivrPreconnect();
			const link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = "https://cdn.jsdelivr.net/npm/katex/dist/katex.min.css";
			document.head.appendChild(link);
		}
	}
	private static updateBodyClasses() {
		const path = window.location.pathname.replace(/\/$/, "");
		const isHome = path === "" || /^\/page\/\d+$/.test(path);
		if (isHome) {
			document.body.classList.add("is-home");
		} else {
			document.body.classList.remove("is-home");
		}
	}

	private static async initMermaid() {
		const els = document.querySelectorAll<HTMLPreElement>(".mermaid-src");
		if (!els.length) return;
		try {
			const { default: mermaid } = await import("mermaid");
			mermaid.initialize({ startOnLoad: false, theme: "default" });
			let idx = 0;
			for (const el of els) {
				const content = el.textContent || "";
				try {
					const { svg } = await mermaid.render(`mermaid-${idx++}`, content);
					const wrapper = document.createElement("div");
					wrapper.className = "mermaid-wrapper";
					wrapper.innerHTML = svg;
					el.replaceWith(wrapper);
				} catch {
					/* render error */
				}
			}
		} catch {
			/* mermaid load error */
		}
	}
	private static initExpressiveCode() {
		if (ecCopyInitialized) return;
		document.addEventListener("click", (e) => {
			const btn = (e.target as HTMLElement).closest(".copy-btn");
			if (!btn) return;
			const codeBlock = btn.closest(".expressive-code");
			if (!codeBlock) return;
			const codeElement = codeBlock.querySelector("code");
			if (!codeElement) return;
			const text = codeElement.innerText;
			navigator.clipboard.writeText(text).then(() => {
				btn.classList.add("success");
				setTimeout(() => {
					btn.classList.remove("success");
				}, 2000);
			});
		});
		ecCopyInitialized = true;
	}
	private static initGoPage() {
		const targetDisplay = document.getElementById("target-url");
		if (!targetDisplay) return;
		const urlParams = new URLSearchParams(window.location.search);
		let targetUrl = urlParams.get("url");
		if (!targetUrl && urlParams.get("target")) {
			try {
				targetUrl = atob(urlParams.get("target") || "");
			} catch {
				/* expected */
			}
		}
		const continueLink = document.getElementById(
			"continue-link",
		) as HTMLAnchorElement;
		const cancelBtn = document.getElementById("cancel-btn");
		const invalidText = targetDisplay.dataset.invalid || "Invalid Link";
		if (!targetUrl) {
			targetDisplay.innerText = invalidText;
			return;
		}
		try {
			const parsed = new URL(targetUrl);
			if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
				targetDisplay.innerText = invalidText;
				return;
			}
		} catch {
			targetDisplay.innerText = invalidText;
			return;
		}
		let displayUrl = targetUrl;
		try {
			displayUrl = decodeURIComponent(targetUrl);
		} catch {
			/* expected */
		}
		targetDisplay.innerText = displayUrl;
		if (continueLink) {
			continueLink.href = targetUrl;
			continueLink.target = "_blank";
			continueLink.rel = "nofollow noopener noreferrer";
		}
		if (cancelBtn) {
			cancelBtn.onclick = () => {
				if (window.history.length > 1) window.history.back();
				else window.location.href = "/";
			};
		}
		try {
			const targetObj = new URL(targetUrl);
			const trusted = isInternalDomain(targetObj.hostname);
			if (trusted) {
				targetDisplay.innerHTML = `<span class="flex items-center justify-center gap-2"><svg class="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Redirecting to trusted site...</span>`;
				setTimeout(() => {
					if (targetUrl) window.location.href = targetUrl;
				}, 800);
			}
		} catch {
			/* expected */
		}
	}
	private static _initializePageContent() {
		PageLifecycle.updateBodyClasses();
		setTimeout(() => PageLifecycle.initMermaid(), 0);
		PageLifecycle.initExpressiveCode();
		PageLifecycle.initGoPage();
		setTimeout(() => {
			PageLifecycle.lazyLoadAssets();
		}, 150);
	}
	public static onPageLoad(): void {
		PageLifecycle._initializePageContent();
	}
}
