import Hero from "@/components/ui/Hero";
import AboutPage from "@/components/pages/AboutPage";
import { useCallback, useRef, useState, useEffect } from "react";
import useScrollHijack from "@/hooks/useScrollHijack";
import Direction from "@/types/direction";

interface HomePageProps {
	headerRef: React.RefObject<HTMLElement | null>;
}

export default function HomePage({ headerRef }: Readonly<HomePageProps>) {
	const [areButtonsVisible, setAreButtonsVisible] = useState(false);
	const isVisibleRef = useRef(areButtonsVisible);
	const aboutSectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		isVisibleRef.current = areButtonsVisible;
	}, [areButtonsVisible]);

	const handleScrollAttempt = useCallback(
		(direction: Direction) => {
			if (direction === "up") {
				if (headerRef.current) {
					headerRef.current.scrollIntoView({ behavior: "smooth" });
					window.history.pushState(null, "", "/#mainHeader");
				}
			} else if (direction === "down") {
				if (!isVisibleRef.current) {
					setAreButtonsVisible(true); // Show buttons on first scroll down
				} else if (isVisibleRef.current && aboutSectionRef.current) {
					// Scroll to about on second scroll down
					aboutSectionRef.current.scrollIntoView({
						behavior: "smooth",
					});
					window.history.pushState(null, "", "/#about");
					// Optional: Keep buttons visible or hide them again
					// setAreButtonsVisible(false);
				}
			}
		},
		[headerRef, aboutSectionRef],
	);

	useScrollHijack({
		callback: handleScrollAttempt,
		throttleDelay: 700,
		enabled: true,
	});

	// Optional: Initial hash handling
	useEffect(() => {
		const timer = setTimeout(() => {
			const hash = window.location.hash;
			if (hash === "#about" && aboutSectionRef.current) {
				aboutSectionRef.current.scrollIntoView({ behavior: "auto" });
				setAreButtonsVisible(true);
			} else if (hash === "#mainHeader" && headerRef.current) {
				headerRef.current.scrollIntoView({ behavior: "auto" });
				setAreButtonsVisible(false);
			} else if (!hash || hash === "#") {
				// Ensure buttons start hidden on initial load at the top
				setAreButtonsVisible(false);
			}
		}, 100);
		return () => clearTimeout(timer);
	}, [headerRef]);

	return (
		<main className="min-h-dvh">
			<section id="hero" className="relative">
				<Hero areButtonsVisible={areButtonsVisible} />
			</section>

			{/* About section */}
			<section ref={aboutSectionRef} id="about">
				<AboutPage />
			</section>
		</main>
	);
}
