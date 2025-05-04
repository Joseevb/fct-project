import AboutPage from "@/components/pages/AboutPage";
import Hero from "@/components/ui/Hero";
import useScrollHijack from "@/hooks/useScrollHijack";
import direction from "@/types/direction";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface HomePageProps {
	headerRef: React.RefObject<HTMLElement | null>;
}

export default function HomePage({ headerRef }: Readonly<HomePageProps>) {
	const [areButtonsVisible, setAreButtonsVisible] = useState(false);
	const [searchParams] = useSearchParams();

	const paymentStatus = searchParams.get("paymentSuccess");
	const headerHeight = headerRef.current?.offsetHeight || 0;
	const heroMarginTop = headerHeight + 35;

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

	const handleScrollAttempt = useCallback(
		(direction: direction) => {
			// Get header height
			console.log(direction);
			switch (direction) {
				case "up":
					if (heroRef.current) {
						window.scrollTo({
							top: heroRef.current.offsetTop - heroMarginTop,
							behavior: "smooth",
						});

						window.history.pushState(
							{ fromProgrammaticScroll: true },
							"",
							"/#main",
						);

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

							window.history.pushState(
								{ fromProgrammaticScroll: true },
								"",
								"/#about",
							);
						}
						setAreButtonsVisible(false);
					} else {
						setAreButtonsVisible(true);
					}
					break;
			}
		},
		[areButtonsVisible, headerHeight, heroMarginTop],
	);

	const autoCallback = useMemo(
		() => ({
			callback: () => handleScrollAttempt("down"),
			delay: 1000,
			repeat: false,
		}),
		[handleScrollAttempt],
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

	useScrollHijack({
		callback: handleScrollAttempt,
		throttleDelay: 700,
		autoCallback,
	});

	return (
		<div className="flex flex-col items-center justify-center h-screen w-screen">
			<main className="h-screen w-screen">
				<section
					ref={heroRef}
					id="hero"
					className={`relative h-screen mx-3`}
					style={{ marginBlockStart: `${heroMarginTop}px` }}
				>
					<Hero areButtonsVisible={areButtonsVisible} />
				</section>

				{/* About section */}
				<section
					ref={aboutRef}
					id="about"
					className="relative h-screen"
				>
					<AboutPage />
				</section>
			</main>
		</div>
	);
}
