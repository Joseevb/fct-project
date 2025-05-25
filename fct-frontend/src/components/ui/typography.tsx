import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

interface TypographyPProps {
	children: ReactNode;
	className?: string;
	props?: HTMLAttributes<HTMLParagraphElement>;
}

function TypographyP({ children, className, props }: TypographyPProps) {
	return (
		<p
			className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
			{...props}
		>
			{children}
		</p>
	);
}

interface TypographyHProps {
	children: ReactNode;
	className?: string;
	props?: HTMLAttributes<HTMLHeadingElement>;
}

function TypographyH2({ children, className, props }: TypographyHProps) {
	return (
		<h2
			className={cn(
				"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
				className,
			)}
			{...props}
		>
			{children}
		</h2>
	);
}

function TypographyH3({ children, className, props }: TypographyHProps) {
	return (
		<h3
			className={cn(
				"scroll-m-20 text-2xl font-semibold tracking-tight",
				className,
			)}
			{...props}
		>
			{children}
		</h3>
	);
}

interface TypographyListProps {
	children: ReactNode;
	className?: string;
	props?: HTMLAttributes<HTMLUListElement>;
}

function TypographyList({ children, className, props }: TypographyListProps) {
	return (
		<ul
			className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
			{...props}
		>
			{children}
		</ul>
	);
}

export { TypographyP, TypographyH2, TypographyH3, TypographyList };
