import type { ReactElement } from "react";

export const StripeFooter = (): ReactElement => {
	return (
		<div className="absolute bottom-0 left-0 right-0 h-[3px] flex z-10">
			<div className="bg-rl-teal w-1/3" />
			<div className="bg-rl-gold w-1/3" />
			<div className="bg-rl-red w-1/3" />
		</div>
	);
};
