import AboutPage from "@/components/pages/AboutPage";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Hero from "@/components/ui/Hero";
import InfoSection from "@/components/ui/InfoSection";
import { useScreenSize } from "@/hooks/useScreenSize";
import useScrollHijack from "@/hooks/useScrollHijack";
import direction from "@/types/direction";
import { pushState, replaceState } from "history-throttled";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HomePageProps {
	headerRef: React.RefObject<HTMLElement | null>;
	clearLineItems: () => void;
}

export default function HomePage({
	headerRef,
	clearLineItems,
}: Readonly<HomePageProps>) {
	const [isAboutAtTop, setIsAboutAtTop] = useState(false);

	const [searchParams] = useSearchParams();

	const paymentStatus: "success" | "failure" | null = searchParams.get(
		"paymentStatus",
	) as "success" | "failure" | null;

	const screenSize = useScreenSize();

	const heroRef = useRef<HTMLDivElement>(null);
	const aboutRef = useRef<HTMLDivElement>(null);
	const mainRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress: aboutScrollYProgress } = useScroll({
		target: aboutRef,
		offset: ["start end", "start start"],
	});
	// Add CSS scroll padding when component mounts
	useEffect(() => {
		clearLineItems();
		// Apply scroll padding
		document.documentElement.style.scrollPaddingTop = `${headerRef.current?.offsetHeight || 0}px`;

		// Cleanup when component unmounts
		return () => {
			document.documentElement.style.scrollPaddingTop = "";
		};
	}, [clearLineItems, headerRef]);

	useMotionValueEvent(aboutScrollYProgress, "change", () => {
		if (aboutRef.current && headerRef.current) {
			const aboutRect = aboutRef.current.getBoundingClientRect();
			const headerRect = headerRef.current.getBoundingClientRect();

			if (aboutRect.top <= headerRect.bottom) {
				setIsAboutAtTop(true);
			} else {
				setIsAboutAtTop(false);
			}
		}
	});

	const handleScrollAttempt = useCallback((direction: direction) => {
		const aboutTop = aboutRef.current?.offsetTop || 0;

		switch (direction) {
			case "up":
				window.scrollTo({
					top: 0,
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
		enabled: screenSize !== "xs" && !isAboutAtTop,
		elementRef: mainRef,
	});

	return (
		<div className="w-full">
			<Dialog defaultOpen={paymentStatus != null}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{paymentStatus === "success" && "Pago exitoso"}
							{paymentStatus === "failure" && "Pago fallido"}
						</DialogTitle>
					</DialogHeader>
					<DialogFooter>
						<DialogTrigger
							onClick={() => {
								replaceState("", "", "/");
							}}
						>
							<Button>Cerrar</Button>
						</DialogTrigger>
					</DialogFooter>
				</DialogContent>
			</Dialog>
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
