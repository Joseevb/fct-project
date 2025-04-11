import { useState, useEffect } from "react";

type Direction = "up" | "down" | null;

interface ScrollInfo {
    direction: Direction;
    isScrolling: boolean;
}

const useScrollDirection = (): ScrollInfo => {
    const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
        direction: null,
        isScrolling: false,
    });

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let lastTouchY = 0;
        let timeoutId: number | null = null;
        const scrolling = false;

        const handleWheel = (e: WheelEvent) => {
            const direction: Direction = e.deltaY > 0 ? "down" : "up";
            setScrollInfo({ direction, isScrolling: true });
            resetScrollState();
        };

        const handleTouchStart = (e: TouchEvent) => {
            lastTouchY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const direction: Direction = touchY < lastTouchY ? "down" : "up";
            lastTouchY = touchY;
            setScrollInfo({ direction, isScrolling: true });
            resetScrollState();
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const direction: Direction =
                currentScrollY > lastScrollY ? "down" : "up";
            lastScrollY = currentScrollY;
            setScrollInfo({ direction, isScrolling: true });
            resetScrollState();
        };

        const resetScrollState = () => {
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
            timeoutId = window.setTimeout(() => {
                setScrollInfo((prev) => ({ ...prev, isScrolling: false }));
            }, 100);
        };

        // Event listeners
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        window.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("scroll", handleScroll);
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, []);

    return scrollInfo;
};

export default useScrollDirection;
