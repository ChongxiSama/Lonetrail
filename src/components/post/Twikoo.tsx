import { type ReactElement, useEffect, useRef } from "react";
import { integrationConfig } from "@/config";

export default function Twikoo({
	lang = "zh",
}: {
	lang?: "zh" | "en";
}): ReactElement | null {
	const containerRef = useRef<HTMLDivElement>(null);
	const twikooLang = lang === "en" ? "en" : "zh-CN";
	const envId = integrationConfig.twikoo.envId;

	useEffect(() => {
		const container = containerRef.current;
		if (!container || !envId) return;

		if (
			!document.querySelector(
				'link[href="https://cdn.jsdelivr.net"][rel="preconnect"]',
			)
		) {
			const preconnect = document.createElement("link");
			preconnect.rel = "preconnect";
			preconnect.href = "https://cdn.jsdelivr.net";
			preconnect.crossOrigin = "";
			document.head.appendChild(preconnect);
		}

		const script = document.createElement("script");
		script.src =
			"https://cdn.jsdelivr.net/npm/twikoo@1.7.13/dist/twikoo.min.js";
		script.onload = () => {
			window.twikoo.init({
				envId,
				el: "#twikoo-comment",
				lang: twikooLang,
			});
		};
		container.innerHTML = "";
		container.appendChild(script);

		return () => {
			container.innerHTML = "";
		};
	}, [twikooLang, envId]);

	if (!envId) return null;

	return <div id="twikoo-comment" ref={containerRef} />;
}
