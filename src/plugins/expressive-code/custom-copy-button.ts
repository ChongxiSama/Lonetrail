import type { ExpressiveCodePlugin } from "@expressive-code/core";
import { h } from "hastscript";

export function pluginCustomCopyButton(): ExpressiveCodePlugin {
	return {
		name: "Lonetrail Copy Button",
		baseStyles: `
            .lonetrail-copy-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 0.8rem;
                background: #D4621A;
                border: none;
                cursor: pointer;
                transition: all 0.2s ease;
                height: 1.4rem;
                min-width: 50px;
                box-sizing: border-box;
                border-radius: 0;
            }
            .lonetrail-copy-btn:hover {
                background: #F07522;
                box-shadow: 0 0 10px rgba(212, 98, 26, 0.4);
            }
            .lonetrail-copy-btn:active {
                transform: scale(0.95);
            }
            .lonetrail-copy-text {
                font-family: var(--font-mono);
                font-size: 10px;
                font-weight: 900;
                color: rgb(var(--ce-text-hero));
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
        `,
		hooks: {
			postprocessRenderedBlock: ({ renderData }) => {
				const copyButton = h(
					"button",
					{
						class: "lonetrail-copy-btn copy-btn",
						"aria-label": "Copy",
						style: "position: absolute; top: 0.6rem; right: 1rem; z-index: 30;",
					},
					[h("span", { class: "lonetrail-copy-text" }, "COPY")],
				);

				renderData.blockAst.children.push(copyButton);
			},
		},
	};
}
