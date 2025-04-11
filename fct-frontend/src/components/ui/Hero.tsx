import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { heroImages } from "@/assets/hero";

export default function Hero() {
    return (
        <section className="min-w-dvw p-3 my-5 rounded shadow">
            <Carousel
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 2000 })]}
            >
                <CarouselContent>
                    {heroImages.map((img, idx) => (
                        <CarouselItem key={idx}>
                            <img
                                src={img}
                                alt="hero banner"
                                className="rounded"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}
