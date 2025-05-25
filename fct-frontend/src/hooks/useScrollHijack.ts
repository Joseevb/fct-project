import Direction from "@/types/direction";
import { useMotionValueEvent, useScroll } from "motion/react";

// Type for the callback function the hook user will provide
type ScrollCallback = (direction: Direction) => void;

interface UseScrollHijackOptions {
	/** The callback function to execute on a throttled scroll attempt. */
	callback: ScrollCallback;
	/** Optional ref to the scrollable element. Defaults to window. */
	elementRef?: React.RefObject<HTMLElement | null>;
	/** Should the hook be active? Defaults to true */
	enabled?: boolean;
}

/**
 * A hook to intercept all scroll events (wheel, touch, keyboard),
 * prevent default scroll, detect direction, and trigger a throttled callback.
 */
export default function useScrollHijack({
	enabled = true,
	callback,
	elementRef,
}: UseScrollHijackOptions) {
	const { scrollY } = useScroll({ target: elementRef });

	useMotionValueEvent(scrollY, "change", (current) => {
		const previous = scrollY.getPrevious();
		if (previous === undefined || !enabled) return;

		const diff = current - previous;
		const direction: Direction = diff > 0 ? "down" : "up";

		callback(direction);
	});
}
