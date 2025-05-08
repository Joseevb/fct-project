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

export default function Hero() {
	const autoplay = Autoplay({
		delay: 1500,
		stopOnInteraction: false,
		active: true,
		stopOnMouseEnter: true,
	});

	return (
		<div className="rounded">
			<Carousel
				opts={{ loop: true }}
				className="relative w-full max-h-[50vh] overflow-hidden rounded shadow top-10 mb-15" // Height constraint is here
				plugins={[autoplay]}
			>
				<CarouselContent className="h-full rounded">
					{heroItems.map((item) => (
						<CarouselItem
							key={item.id}
							className="relative h-full flex justify-center items-end rounded group"
						>
							<div className="relative w-full h-full rounded">
								<img
									src={item.imgSrc}
									alt={item.imgAlt}
									className={cn(
										"block max-h-[50vh] w-full object-cover rounded", // Fill item, cover area
										item.imgObjectPosition ||
											"object-center", // Apply specific positioning
									)}
								/>

								<div className="absolute inset-0 bg-background/5 group-hover:bg-black/20 transition-all duration-100 backdrop-blur-sm rounded"></div>
							</div>

							<div className="absolute bottom-10 z-10 flex items-center justify-center">
								<Link
									to={item.buttonUrl || "#"}
									className={cn(
										buttonVariants({
											variant: "hero",
											size: "lg",
										}),
										"md:text-3xl",
										"text-2xl text-shadow-lg",
										"md:py-9 md:px-10",
										"py-8 px-9",
									)}
								>
									{item.buttonLabel}
								</Link>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20" />
				<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20" />{" "}
			</Carousel>
		</div>
	);
}
