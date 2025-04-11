import Hero from "@/components/ui/Hero";
import AboutPage from "@/components/pages/AboutPage";
import useScrollDirection from "@/hooks/useScrollDirection";
import { useEffect, useRef } from "react";

export default function HomePage() {
    const { direction } = useScrollDirection();
    const aboutSectionRef = useRef<HTMLDivElement>(null);
    const heroSectionRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef(false);

    useEffect(() => {
        const handleScrollNavigation = () => {
            if (isScrolling.current) return;

            isScrolling.current = true;

            if (direction === "down" && aboutSectionRef.current) {
                aboutSectionRef.current.scrollIntoView({
                    behavior: "smooth",
                });
                window.history.pushState(null, "", "/#about");
            } else if (direction === "up" && heroSectionRef.current) {
                heroSectionRef.current.scrollIntoView({
                    behavior: "smooth",
                });
                window.history.pushState(null, "", "/");
            }

            // Reset after scroll completes
            setTimeout(() => {
                isScrolling.current = false;
            }, 1000);
        };

        handleScrollNavigation();
    }, [direction]);

    // Handle initial hash URL
    useEffect(() => {
        if (window.location.hash === "#about" && aboutSectionRef.current) {
            aboutSectionRef.current.scrollIntoView();
        }
    }, []);

    return (
        <main className="min-h-dvh">
            <div ref={heroSectionRef}>
                <Hero />
            </div>
            <div ref={aboutSectionRef} id="about">
                <AboutPage />
            </div>
        </main>
    );
}
