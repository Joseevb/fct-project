import AboutPage from "@/components/pages/AboutPage";
import Hero from "@/components/ui/Hero";
import useScrollHijack from "@/hooks/useScrollHijack";
import direction from "@/types/direction";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import InfoSection from "@/components/ui/InfoSection";
import { useScreenSize } from "@/hooks/useScreenSize";

interface HomePageProps {
	headerRef: React.RefObject<HTMLElement | null>;
}

export default function HomePage({ headerRef }: Readonly<HomePageProps>) {
	const [searchParams] = useSearchParams();
	const [isInHeroSection, setIsInHeroSection] = useState(true);

	const paymentStatus = searchParams.get("paymentSuccess");
	const headerHeight = headerRef.current?.offsetHeight || 0;
	const heroMarginTop = headerHeight + 35;
	const scrollThreshold = -5; // Increased threshold for earlier trigger

	const screenSize = useScreenSize();

	const heroRef = useRef<HTMLDivElement>(null);
	const aboutRef = useRef<HTMLDivElement>(null);

	// Add CSS scroll padding when component mounts
	useEffect(() => {
		// Apply scroll padding
		document.documentElement.style.scrollPaddingTop = `${headerRef.current?.offsetHeight || 0}px`;

		// Cleanup when component unmounts
		return () => {
			document.documentElement.style.scrollPaddingTop = "";
		};
	}, [headerRef]);

	useEffect(() => {
		if (paymentStatus) {
			toast.success("Pago exitoso", {
				// Show toast on success
				richColors: true,
			});
		}
	}, [paymentStatus]);

	// Track scroll position to determine if we're in the hero section
	useEffect(() => {
		const handleScroll = () => {
			const currentScroll = window.scrollY;
			const aboutTop = aboutRef.current?.offsetTop || 0;
			// Add threshold to make the transition smoother
			setIsInHeroSection(
				currentScroll < aboutTop - headerHeight - scrollThreshold,
			);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [headerHeight, scrollThreshold]);

	const handleScrollAttempt = useCallback(
		(direction: direction) => {
			const currentScroll = window.scrollY;
			const aboutTop = aboutRef.current?.offsetTop || 0;
			const heroTop = heroRef.current?.offsetTop || 0;

			// If we're in the about section, let the native scroll handle it
			if (currentScroll > aboutTop - headerHeight - scrollThreshold) {
				return;
			}

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
							top: aboutTop - headerHeight - scrollThreshold,
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
		},
		[headerHeight, heroMarginTop, scrollThreshold],
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
		throttleDelay: 200,
		enabled: screenSize !== "xs" && isInHeroSection,
		// enabled: false,
	});

	return (
		<div className="w-full">
			<main>
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
