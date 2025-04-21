import AboutPage from "@/components/pages/AboutPage";
import Hero from "@/components/ui/Hero";
import useScrollHijack from "@/hooks/useScrollHijack";
import direction from "@/types/direction";
import { useCallback, useEffect, useRef, useState } from "react";

interface HomePageProps {
	headerRef: React.RefObject<HTMLElement | null>;
}

export default function HomePage({ headerRef }: Readonly<HomePageProps>) {
	const [areButtonsVisible, setAreButtonsVisible] = useState(false);

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

	const handleScrollAttempt = useCallback(
		(direction: direction) => {
			// Get header height
			const headerHeight = headerRef.current?.offsetHeight || 0;
			switch (direction) {
				case "up":
					if (heroRef.current) {
						window.scrollTo({
							top: heroRef.current.offsetTop - headerHeight,
							behavior: "smooth",
						});

						window.history.pushState(null, "", "/#hero");

						if (areButtonsVisible) setAreButtonsVisible(false);
					}
					break;
				case "down":
					if (areButtonsVisible) {
						if (aboutRef.current) {
							window.scrollTo({
								top: aboutRef.current.offsetTop - headerHeight,
								behavior: "smooth",
							});

							window.history.pushState(null, "", "/#about");
						}
						setAreButtonsVisible(false);
					} else {
						setAreButtonsVisible(true);
					}
					break;
			}
		},
		[areButtonsVisible, headerRef],
	);

	useScrollHijack({
		callback: handleScrollAttempt,
		throttleDelay: 1,
	});

	return (
		<main className="min-h-screen">
			<section ref={heroRef} id="hero" className="relative h-screen">
				<Hero areButtonsVisible={areButtonsVisible} />
			</section>

			{/* About section */}
			<section ref={aboutRef} id="about" className="relative h-screen">
				<AboutPage />
			</section>
		</main>
	);
}
