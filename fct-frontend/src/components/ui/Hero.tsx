import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { heroItems } from "@/data/heroData";

// interface HeroProps { // Remove if areButtonsVisible is no longer used
//     areButtonsVisible: boolean;
// }
// export default function Hero({ areButtonsVisible }: Readonly<HeroProps>) {

// Simplified signature if areButtonsVisible is unused
export default function Hero() {
	const autoplay = Autoplay({
		delay: 4000,
		stopOnInteraction: false,
		// active: true, // Make sure autoplay is active if desired
	});

	return (
		<div className="my-5">
			{" "}
			{/* Optional wrapper for margin */}
			<Carousel
				opts={{ loop: true }}
				// Carousel itself defines the boundary and positioning context
				className="relative w-full max-h-[50vh] overflow-hidden rounded shadow top-10" // Height constraint is here
				plugins={[autoplay]}
			>
				{/* CarouselContent MUST fill the height of the Carousel */}
				<CarouselContent className="h-full">
					{" "}
					{/* <<< ADDED h-full */}
					{heroItems.map((item) => (
						// CarouselItem MUST also fill the height AND be relative for the button
						<CarouselItem key={item.id} className="relative h-full">
							{" "}
							{/* <<< ADDED h-full */}
							{/* Image MUST fill the item AND use object-cover */}
							<img
								src={item.imgSrc}
								alt={item.imgAlt}
								className={cn(
									"block h-full w-full object-cover", // Fill item, cover area
									item.imgObjectPosition || "object-center", // Apply specific positioning
								)}
							/>
							{/* Button Container: Absolute position relative to CarouselItem */}
							{/* Centered horizontally and positioned near the bottom */}
							<div className="absolute bottom-10 left-1/2 z-10 flex w-full -translate-x-1/2 items-center justify-center p-4 md:w-auto">
								<Link
									to={item.buttonUrl || "#"}
									className={cn(
										buttonVariants({
											variant: "secondary", // Or your 'hero' if defined well
											size: "lg",
										}),
										// Base styles for overlay button
										"font-semibold shadow-md transition-transform duration-200 ease-out hover:scale-105",
										"bg-background/70 hover:bg-background/80 backdrop-blur-sm", // Semi-transparent bg
										"text-base md:text-lg lg:text-xl px-6 py-3 md:px-8 md:py-4", // Responsive text/padding
									)}
								>
									{item.buttonLabel}
								</Link>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				{/* Previous/Next buttons positioned relative to Carousel */}
				<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20" />
				{/* Higher z-index */}
				<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20" />{" "}
				{/* Higher z-index */}
			</Carousel>
		</div>
	);
}
