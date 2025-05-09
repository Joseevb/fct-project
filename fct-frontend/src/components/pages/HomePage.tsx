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
import InfoSection from "@/components/ui/InfoSection";
import { useScreenSize } from "@/hooks/useScreenSize";
import useScrollHijack from "@/hooks/useScrollHijack";
import direction from "@/types/direction";
import { pushState, replaceState } from "history-throttled";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface HomePageProps {
	headerRef: React.RefObject<HTMLElement | null>;
}

export default function HomePage({ headerRef }: Readonly<HomePageProps>) {
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
