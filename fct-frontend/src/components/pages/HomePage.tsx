import AboutPage from "@/components/pages/AboutPage";
import Hero from "@/components/ui/Hero";
import useScrollHijack from "@/hooks/useScrollHijack";
import direction from "@/types/direction";
import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import InfoSection from "@/components/ui/InfoSection";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useInView } from "motion/react";

interface HomePageProps {
	headerRef: React.RefObject<HTMLElement | null>;
}

export default function HomePage({ headerRef }: Readonly<HomePageProps>) {
	const [searchParams] = useSearchParams();

	const paymentStatus = searchParams.get("paymentSuccess");
	const headerHeight = headerRef.current?.offsetHeight || 0;
	const heroMarginTop = headerHeight + 35;
	const scrollThreshold = 75; // Increased threshold for earlier trigger

	const screenSize = useScreenSize();

	const heroRef = useRef<HTMLDivElement>(null);
	const aboutRef = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLDivElement>(null);

	const isInHeroSection = useInView(heroRef, { once: false, amount: "some" });
	const isInAboutSection = useInView(aboutRef, {
		once: false,
		amount: "some",
	});

	useEffect(() => {
		if (paymentStatus) {
			toast.success("Pago exitoso", {
				// Show toast on success
				richColors: true,
			});
		}
	}, [paymentStatus]);

	const handleScrollAttempt = useCallback(
		(direction: direction) => {
			const aboutTop = aboutRef.current?.offsetTop || 0;
			const heroTop = heroRef.current?.offsetTop || 0;

			// Handle section snapping
			switch (direction) {
				case "up":
					if (heroRef.current) {
						window.scrollTo({
							top: heroTop - heroMarginTop,
							behavior: "smooth",
						});

						window.history.pushState(
							{ fromProgrammaticScroll: true },
							"",
							"/#main",
						);
					}
					break;
				case "down":
					if (aboutRef.current) {
						window.scrollTo({
							top: aboutTop - headerHeight + scrollThreshold,
							behavior: "smooth",
						});

						window.history.pushState(
							{ fromProgrammaticScroll: true },
							"",
							"/#about",
						);
					}
					break;
			}

			console.log("is hero visible", isInHeroSection);
			console.log("is about visible", isInAboutSection);
		},
		[
			headerHeight,
			heroMarginTop,
			isInAboutSection,
			isInHeroSection,
			scrollThreshold,
		],
	);

	useEffect(() => {
		const hash = window.location.hash;
		const isFromUserNavigation =
			!window.history.state?.fromProgrammaticScroll;

		if (isFromUserNavigation) {
			switch (hash) {
				case "#main":
					handleScrollAttempt("up");
					break;
				case "#about":
					handleScrollAttempt("down");
					break;
			}
		}
	}, [handleScrollAttempt]);

	// Only enable scroll hijack when we're at the hero section
	useScrollHijack({
		callback: handleScrollAttempt,
		enabled:
			screenSize !== "xs" &&
			(isInHeroSection || (isInHeroSection && isInAboutSection)),
		elementRef: mainRef,
		// enabled: false,
	});

	return (
		<div className="w-full">
			<main ref={mainRef}>
				<section
					ref={heroRef}
					id="hero"
					className="relative mx-3 min-h-screen"
				>
					<Hero />
					<InfoSection />
				</section>

				<section
					ref={aboutRef}
					id="about"
					className="relative mx-3 min-h-screen pt-16"
				>
					<AboutPage />
				</section>
			</main>
		</div>
	);
}
