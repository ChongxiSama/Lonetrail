document.addEventListener("click", (e) => {
	const btn = (e.target as Element)?.closest(".share-btn");
	if (!btn) return;
	const url = btn.getAttribute("data-url");
	if (url) {
		navigator.clipboard.writeText(url).then(() => {
			const orig = btn.innerHTML;
			btn.innerHTML = document.documentElement.lang.startsWith("en")
				? "✓ Copied"
				: "✓ 已复制";
			setTimeout(() => (btn.innerHTML = orig), 2000);
		});
	}
});
