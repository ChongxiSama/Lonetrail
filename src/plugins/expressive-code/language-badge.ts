import type { ExpressiveCodePlugin } from "@expressive-code/core";
import { h } from "hastscript";

export function pluginLanguageBadge(): ExpressiveCodePlugin {
	return {
		name: "Lonetrail Language Badge",
		baseStyles: `
            .lonetrail-badge {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.5rem 1rem;
                background: #24221E;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            .lonetrail-dots {
                display: flex;
                gap: 0.25rem;
            }
            .lonetrail-dot {
                width: 6px;
                height: 6px;
            }
            .lonetrail-dot-red { background: #A33332; opacity: 0.8; }
            .lonetrail-dot-gold { background: #C29145; opacity: 0.8; }
            .lonetrail-dot-teal { background: #4B8D9E; opacity: 0.8; }
            
            .lonetrail-protocol {
                font-family: var(--font-mono);
                font-size: 10px;
                font-weight: 900;
                letter-spacing: 0.2em;
                color: rgba(237, 230, 214, 0.8);
                text-transform: uppercase;
            }
            .lonetrail-lang {
                color: #D4621A;
            }
        `,
		hooks: {
			postprocessRenderedBlock: ({ renderData, codeBlock }) => {
				const lang = codeBlock.language.toUpperCase() || "PLAINTEXT";

				const badge = h("div", { class: "lonetrail-badge" }, [
					h("div", { class: "lonetrail-dots" }, [
						h("div", { class: "lonetrail-dot lonetrail-dot-red" }),
						h("div", { class: "lonetrail-dot lonetrail-dot-gold" }),
						h("div", { class: "lonetrail-dot lonetrail-dot-teal" }),
					]),
					h("div", {
						class: "h-3 w-[1px] bg-white/10 mx-1",
					}),
					h("span", { class: "lonetrail-protocol" }, [
						"PRTCL // ",
						h("span", { class: "lonetrail-lang" }, lang),
					]),
				]);

				renderData.blockAst.children.unshift(badge);
			},
		},
	};
}
