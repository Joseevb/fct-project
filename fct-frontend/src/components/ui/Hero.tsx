import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
import { heroImages } from "@/assets/hero";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface HeroProps {
	areButtonsVisible: boolean;
}

export default function Hero({ areButtonsVisible }: Readonly<HeroProps>) {
	const buttonStyle = cn("sm:text-base");

	const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });

	return (
		<div className="relative h-screen p-3 my-5 rounded shadow">
			<Carousel
				opts={{ loop: true }}
				className="h-ful w-full"
				plugins={[autoplay]}
				// Add overflow-hidden if buttons slightly exceeding bounds is an issue
				// className="overflow-hidden rounded"
			>
				<CarouselContent className="h-full">
					{heroImages.map((img, idx) => (
						<CarouselItem
							key={idx}
							className="h-full overflow-hidden"
						>
							{/* <AspectRatio ratio={16 / 9}> */}
							<img
								src={img}
								alt={`Hero banner ${idx + 1}`}
								className="block h-full w-full object-cover rounded"
							/>
							{/* </AspectRatio> */}
						</CarouselItem>
					))}
				</CarouselContent>
				{/* --- Button Container  --- */}
				<div
					className={cn(
						// Base styles: absolute positioning, centering, flex, z-index
						// Position relative to the inner div now
						"absolute w-fill bottom-10 left-1/2 z-10 flex w-auto -translate-x-1/2 justify-center space-x-15",
						// Transition styles
						"transition-all duration-500 ease-in-out",
						// Conditional styles based on passed prop
						areButtonsVisible
							? "opacity-100 translate-y-0"
							: "pointer-events-none translate-y-4 opacity-0",
					)}
				>
					{/* Individual Buttons */}
					<Link
						to="/appointments"
						className={cn(
							buttonVariants({
								variant: "outline",
							}),
							buttonStyle,
						)}
					>
						Citas
					</Link>
					<Link
						to="/courses"
						className={cn(
							buttonVariants({
								variant: "outline",
							}),
							buttonStyle,
						)}
					>
						Cursos
					</Link>
					<Link
						to="/products"
						className={cn(
							buttonVariants({
								variant: "outline",
							}),
							buttonStyle,
						)}
					>
						Productos
					</Link>
				</div>
			</Carousel>
		</div>
	);
}
