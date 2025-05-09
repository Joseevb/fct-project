import AboutPage from "@/components/pages/AboutPage";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Hero from "@/components/ui/Hero";
<<<<<<< HEAD
import InfoSection from "@/components/ui/InfoSection";
import { useScreenSize } from "@/hooks/useScreenSize";
import useScrollHijack from "@/hooks/useScrollHijack";
import direction from "@/types/direction";
import { pushState, replaceState } from "history-throttled";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
=======
import useScrollHijack from "@/hooks/useScrollHijack";
import direction from "@/types/direction";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import InfoSection from "@/components/ui/InfoSection";
import { useScreenSize } from "@/hooks/useScreenSize";
>>>>>>> 81f9d54 (Revert "motion scroll works")

interface HomePageProps {
	headerRef: React.RefObject<HTMLElement | null>;
}

export default function HomePage({ headerRef }: Readonly<HomePageProps>) {
	const [isAboutAtTop, setIsAboutAtTop] = useState(false);

	const [searchParams] = useSearchParams();
	const [isInHeroSection, setIsInHeroSection] = useState(true);

<<<<<<< HEAD
	const paymentStatus: "success" | "failure" | null = searchParams.get(
		"paymentStatus",
	) as "success" | "failure" | null;
=======
	const paymentStatus = searchParams.get("paymentSuccess");
	const headerHeight = headerRef.current?.offsetHeight || 0;
	const heroMarginTop = headerHeight + 35;
	const scrollThreshold = -5; // Increased threshold for earlier trigger
>>>>>>> 81f9d54 (Revert "motion scroll works")

	const screenSize = useScreenSize();

	const heroRef = useRef<HTMLDivElement>(null);
	const aboutRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
	const { scrollYProgress: aboutScrollYProgress } = useScroll({
		target: aboutRef,
		offset: ["start end", "start start"],
	});
=======
	// Add CSS scroll padding when component mounts
	useEffect(() => {
		// Apply scroll padding
		document.documentElement.style.scrollPaddingTop = `${headerRef.current?.offsetHeight || 0}px`;

		// Cleanup when component unmounts
		return () => {
			document.documentElement.style.scrollPaddingTop = "";
		};
	}, [headerRef]);
>>>>>>> 81f9d54 (Revert "motion scroll works")

	useMotionValueEvent(aboutScrollYProgress, "change", () => {
		if (aboutRef.current && headerRef.current) {
			const aboutRect = aboutRef.current.getBoundingClientRect();
			const headerRect = headerRef.current.getBoundingClientRect();

<<<<<<< HEAD
			if (aboutRect.top <= headerRect.bottom) {
				setIsAboutAtTop(true);
			} else {
				setIsAboutAtTop(false);
			}
		}
	});

	const handleScrollAttempt = useCallback((direction: direction) => {
		const aboutTop = aboutRef.current?.offsetTop || 0;
		const heroTop = heroRef.current?.offsetTop || 0;

		switch (direction) {
			case "up":
				window.scrollTo({
					top:
						heroTop -
						Number(
							window.getComputedStyle(heroRef.current as Element)
								.marginBlockStart,
						),
					behavior: "smooth",
				});

				pushState({ fromProgrammaticScroll: true }, "", "#main");
				break;
			case "down":
				window.scrollTo({
					top: aboutTop,
					behavior: "smooth",
				});

				pushState({ fromProgrammaticScroll: true }, "", "#about");

				break;
		}
	}, []);
=======
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
>>>>>>> 81f9d54 (Revert "motion scroll works")

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
<<<<<<< HEAD
		enabled: screenSize !== "xs" && !isAboutAtTop,
		elementRef: mainRef,
=======
		throttleDelay: 200,
		enabled: screenSize !== "xs" && isInHeroSection,
		// enabled: false,
>>>>>>> 81f9d54 (Revert "motion scroll works")
	});

	return (
		<div className="w-full">
<<<<<<< HEAD
			<AlertDialog defaultOpen={paymentStatus != null}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{paymentStatus === "success" && "Pago exitoso"}
							{paymentStatus === "failure" && "Pago fallido"}
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={() => {
								replaceState("", "", "/");
							}}
						>
							Cerrar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<main ref={mainRef}>
=======
			<main>
>>>>>>> 81f9d54 (Revert "motion scroll works")
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
