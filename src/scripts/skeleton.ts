const SKELETON_HTML = `
    <div class="skeleton-root">
        <div class="skeleton-hero">
            <div class="skeleton-hero-label skeleton-pulse skeleton-pulse--dim"></div>
            <div class="skeleton-hero-title skeleton-pulse"></div>
            <div class="skeleton-hero-divider"></div>
            <div class="skeleton-hero-meta">
                <div class="skeleton-avatar skeleton-pulse"></div>
                <div class="skeleton-meta-text skeleton-pulse skeleton-pulse--dim"></div>
            </div>
            <div class="skeleton-stripe">
                <div class="skeleton-stripe-teal"></div>
                <div class="skeleton-stripe-gold"></div>
                <div class="skeleton-stripe-red"></div>
            </div>
        </div>
        <div class="skeleton-light">
            <div class="skeleton-body">
                <div class="skeleton-body-line skeleton-pulse" style="width:100%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:91%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:84%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:76%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:100%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:63%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:89%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:71%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:95%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:58%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:82%"></div>
                <div class="skeleton-body-line skeleton-pulse" style="width:48%"></div>
            </div>
        </div>
        <div class="skeleton-dark">
            <div class="skeleton-section-header">
                <div class="skeleton-accent-bar"></div>
                <div class="skeleton-section-label skeleton-pulse skeleton-pulse--dim"></div>
                <div class="skeleton-section-line"></div>
            </div>
            <div class="skeleton-link-item skeleton-pulse skeleton-pulse--dim"></div>
            <div class="skeleton-link-item skeleton-pulse skeleton-pulse--dim"></div>
            <div class="skeleton-link-item skeleton-pulse skeleton-pulse--dim"></div>
            <div class="skeleton-stripe">
                <div class="skeleton-stripe-teal"></div>
                <div class="skeleton-stripe-gold"></div>
                <div class="skeleton-stripe-red"></div>
            </div>
        </div>
        <div class="skeleton-dark" style="margin-top:auto">
            <div class="skeleton-footer-line skeleton-pulse skeleton-pulse--dim"></div>
            <div class="skeleton-footer-line skeleton-pulse skeleton-pulse--dimmer"></div>
            <div class="skeleton-stripe">
                <div class="skeleton-stripe-teal"></div>
                <div class="skeleton-stripe-gold"></div>
                <div class="skeleton-stripe-red"></div>
            </div>
        </div>
    </div>
`;

const FADE_OUT_MS = 140;
const IN_ANIM_MS = 400;
const FALLBACK_BUDGET_MS = 260;

let skeletonToken = 0;
let savedFragment: DocumentFragment | null = null;
let enterFromTop = false;

function getMain(): HTMLElement | null {
	return document.getElementById("content-main");
}

function unmountIslands(container: HTMLElement): void {
	for (const island of container.querySelectorAll("astro-island")) {
		island.dispatchEvent(new CustomEvent("astro:unmount"));
	}
}

function detachChildren(container: HTMLElement): DocumentFragment {
	const fragment = document.createDocumentFragment();
	while (container.firstChild) fragment.appendChild(container.firstChild);
	return fragment;
}

function prefersReducedMotion(): boolean {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function enterAnimation(fromPopstate: boolean): string {
	return fromPopstate ? "page-in-up" : "page-in-down";
}

export function showSkeleton(fromPopstate = false): void {
	const main = getMain();
	if (!main) return;

	savedFragment = null;
	const token = ++skeletonToken;
	enterFromTop = fromPopstate;

	if (prefersReducedMotion()) {
		unmountIslands(main);
		savedFragment = detachChildren(main);
		main.innerHTML = SKELETON_HTML;
		return;
	}

	main.style.transition = `opacity ${FADE_OUT_MS}ms ease-out`;
	main.style.opacity = "0";

	const swapIn = () => {
		if (token !== skeletonToken) return;

		main.style.transition = "none";
		main.style.opacity = "";
		unmountIslands(main);
		savedFragment = detachChildren(main);
		main.innerHTML = SKELETON_HTML;
	};

	main.addEventListener(
		"transitionend",
		(event) => {
			if (event.propertyName === "opacity") swapIn();
		},
		{ once: true },
	);
	setTimeout(swapIn, FADE_OUT_MS + FALLBACK_BUDGET_MS);
}

export function animateInMain(): void {
	const main = getMain();
	if (!main) return;
	skeletonToken++;

	if (prefersReducedMotion()) return;

	const animation = enterAnimation(enterFromTop);
	enterFromTop = false;

	main.style.transition = "none";
	main.style.animation = `${animation} 220ms cubic-bezier(0.22,1,0.36,1) forwards`;

	const clear = () => {
		main.style.animation = "";
		main.style.transition = "";
		main.style.opacity = "";
		main.style.transform = "";
	};
	main.addEventListener("animationend", clear, { once: true });
	setTimeout(clear, IN_ANIM_MS);
}

export function restoreContent(): void {
	const main = getMain();
	if (!main) return;
	main.style.transition = "";
	main.style.opacity = "";
	main.style.transform = "";
	main.style.animation = "";
	if (savedFragment && main.querySelector(".skeleton-root")) {
		main.replaceChildren(savedFragment);
		savedFragment = null;
	}
}
