import type { MouseEventHandler, ReactElement, ReactNode } from "react";

type ButtonAs = "button" | "a";
type ButtonVariant =
	| "base"
	| "outline"
	| "solid"
	| "accent"
	| "ghost"
	| "toggle"
	| "chip"
	| "icon"
	| "unstyled";

interface ButtonProps {
	as?: ButtonAs;
	variant?: ButtonVariant;
	active?: boolean;
	className?: string;
	children: ReactNode;
	id?: string;
	type?: "button" | "submit" | "reset";
	href?: string;
	target?: string;
	rel?: string;
	title?: string;
	disabled?: boolean;
	ariaLabel?: string;
	onClick?: MouseEventHandler<HTMLElement>;
	dataShare?: string;
}

const baseClasses =
	"inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
	base: "",
	outline:
		"border border-primary font-deco text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-hero hover:text-on-hero transition-colors duration-150",
	solid:
		"highlight-sweep border border-primary font-deco text-[11px] font-bold uppercase tracking-[0.2em] bg-hero text-on-hero hover:bg-accent hover:border-accent transition-colors duration-150",
	accent:
		"border border-accent font-deco text-[11px] font-bold uppercase tracking-[0.2em] bg-accent text-on-hero dark:text-[#1A1814] hover:bg-hero hover:text-on-hero hover:border-primary transition-colors duration-150",
	ghost:
		"font-deco text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:bg-hero/5 transition-colors duration-150",
	toggle:
		"px-4 py-1.5 font-deco text-[11px] font-bold uppercase tracking-widest border border-transparent transition-colors duration-150 data-[active=true]:bg-hero dark:data-[active=true]:bg-accent data-[active=true]:text-on-hero dark:data-[active=true]:text-white data-[active=true]:shadow-inner data-[active=false]:text-secondary data-[active=false]:hover:text-primary",
	chip: "px-3 py-1 font-deco text-[10px] font-bold uppercase tracking-widest border border-primary/20 transition-colors duration-150 data-[active=true]:bg-accent data-[active=true]:text-white data-[active=true]:border-accent data-[active=true]:shadow-md data-[active=false]:bg-white/50 data-[active=false]:text-hint data-[active=false]:hover:bg-hero data-[active=false]:hover:text-on-hero data-[active=false]:hover:border-primary",
	icon: "text-primary hover:text-accent transition-colors duration-150",
	unstyled: "",
};

export default function Button({
	as = "button",
	variant = "base",
	active,
	className = "",
	class: _class = "",
	children,
	id,
	type = "button",
	href,
	target,
	rel,
	title,
	disabled = false,
	ariaLabel,
	onClick,
	dataShare,
}: ButtonProps & { class?: string }): ReactElement {
	const resolvedClassName = className || _class || "";
	const classes = [baseClasses, variantClasses[variant], resolvedClassName]
		.filter(Boolean)
		.join(" ");

	const dataAttrs: Record<string, string> = {
		"data-active": active ? "true" : "false",
	};
	if (dataShare) {
		dataAttrs["data-share"] = dataShare;
	}

	if (as === "a") {
		return (
			<a
				id={id}
				href={href}
				target={target}
				rel={rel}
				title={title}
				aria-label={ariaLabel}
				aria-disabled={disabled || undefined}
				onClick={onClick}
				className={classes}
				{...dataAttrs}
			>
				{children}
			</a>
		);
	}

	return (
		<button
			id={id}
			type={type}
			disabled={disabled}
			title={title}
			aria-label={ariaLabel}
			onClick={onClick}
			className={classes}
			{...dataAttrs}
		>
			{children}
		</button>
	);
}
