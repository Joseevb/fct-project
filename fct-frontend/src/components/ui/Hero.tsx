import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { heroImages } from "@/assets/hero";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

interface HeroProps {
	areButtonsVisible: boolean;
}

export default function Hero({ areButtonsVisible }: Readonly<HeroProps>) {
	const { resolvedTheme } = useTheme();

	// Enhanced button styles with larger text and padding
	const buttonStyle = cn(
		// Base styles for all screen sizes
		"font-bold transition-all duration-300 shadow",
		"hover:scale-105 hover:shadow-md",
		// Large screens - much bigger buttons with plenty of padding
		"md:text-xl md:px-7 md:py-8",
		// Extra large screens - even larger text
		"lg:text-2xl",
	);

	const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });

	return (
		<div className="relative h-screen p-3 my-5 bg-none ">
			<Carousel
				opts={{ loop: true }}
				className="h-ful w-full"
				plugins={[autoplay]}
			>
				<CarouselContent className="h-full">
					{heroImages.map((img, idx) => (
						<CarouselItem
							key={idx}
							className="h-full overflow-hidden"
						>
							<img
								src={img}
								alt={`Hero banner ${idx + 1}`}
								className="block h-full w-full object-cover rounded"
							/>
						</CarouselItem>
					))}
				</CarouselContent>

				{/* --- Button Container --- */}
				{/* 
					For larger screens: horizontal, huge buttons taking most of width
					For smaller screens: vertical stack, outside carousel, always visible
				*/}
				<div
					className={cn(
						// Base styles
						"z-10 transition-all duration-500 ease-in-out md:max-h-full",

						// Mobile: vertical stack, outside carousel, always visible
						"flex flex-col px-4 w-full absolute -bottom-32 gap-4",

						// Desktop: horizontal layout, inside carousel
						"md:flex-row md:space-y-0 md:justify-center md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 md:w-auto md:gap-5",

						// Larger screens: wider spacing
						"lg:gap-10",

						// Visibility toggle only affects desktop view
						"opacity-100", // Always visible on mobile
						"md:" +
							(areButtonsVisible
								? "opacity-100 translate-y-0"
								: "pointer-events-none translate-y-4 opacity-0"),
					)}
				>
					{/* Buttons - each takes 1/3 of container on desktop */}
					{[
						{ label: "Citas", url: "/appointments" },
						{ label: "Cursos", url: "" },
						{ label: "Productos", url: "" },
					].map((obj, idx) => (
						<Link
							key={idx}
							to={obj.url}
							className={cn(
								buttonVariants({
									variant:
										resolvedTheme === "dark"
											? "default"
											: "outline",
									size: "lg", // Default larger size
								}),
								buttonStyle,
								"w-full md:w-50 lg:w-70", // Full width on mobile, specific width on desktop
							)}
						>
							{obj.label}
						</Link>
					))}
				</div>
			</Carousel>
		</div>
	);
}
