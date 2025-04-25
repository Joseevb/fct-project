// src/hooks/useScrollHijack.ts
import Direction from "@/types/direction";
import { useEffect, useRef, useCallback } from "react";

// Type for the callback function the hook user will provide
type ScrollCallback = (direction: Direction) => void;

interface UseScrollHijackOptions {
	/** The callback function to execute on a throttled scroll attempt. */
	callback: ScrollCallback;
	/** Optional callback function to execute after as set delay */
	autoCallback?: {
		callback: ScrollCallback;
		delay: number;
		repeat: boolean;
	};
	/** Milliseconds to wait before allowing the next scroll trigger. */
	throttleDelay?: number;
	/** Optional ref to the scrollable element. Defaults to window. */
	elementRef?: React.RefObject<HTMLElement>;
	/** Should the hook be active? Defaults to true */
	enabled?: boolean;
	/** Enable keyboard navigation? Defaults to true */
	enableKeyboard?: boolean;
	/** Enable touch navigation? Defaults to true */
	enableTouch?: boolean;
}

/**
 * A hook to intercept all scroll events (wheel, touch, keyboard),
 * prevent default scroll, detect direction, and trigger a throttled callback.
 */
const useScrollHijack = (options: UseScrollHijackOptions): void => {
	const {
		callback,
		autoCallback,
		throttleDelay = 700, // Default throttle delay
		elementRef,
		enabled = true, // Hook is enabled by default
		enableKeyboard = true, // Enable keyboard navigation by default
		enableTouch = true, // Enable touch navigation by default
	} = options;

	const isLocked = useRef<boolean>(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const touchStartY = useRef<number | null>(null);
	const minTouchDistance = 50; // Minimum distance in pixels to trigger a swipe

	// Track if user has “touched” the page
	const userInteractedRef = useRef(false);

	const hasFiredRef = useRef(false);

	// Ref to store the auto timer id
	const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	// Helper to clear whichever timer is pending
	const clearAutoTimer = useCallback(() => {
		if (autoTimerRef.current) {
			clearTimeout(autoTimerRef.current);
			autoTimerRef.current = null;
		}
	}, []);

	// Function to lock scrolling for the throttle delay
	const lockScroll = useCallback(() => {
		// Set the lock
		isLocked.current = true;

		// Clear previous timeout (safety measure)
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Release the lock after the throttle delay
		timeoutRef.current = setTimeout(() => {
			isLocked.current = false;
		}, throttleDelay);
	}, [throttleDelay]);

	// Trigger callback with direction and lock scrolling
	const triggerScroll = useCallback(
		(direction: Direction) => {
			if (isLocked.current) return;

			callback(direction);
			lockScroll();
			userInteractedRef.current = true;
			clearAutoTimer();
		},
		[callback, clearAutoTimer, lockScroll],
	);

	// Handle wheel events (mouse wheel, trackpad)
	const handleWheel = useCallback(
		(event: WheelEvent) => {
			// Prevent default scroll action
			event.preventDefault();

			// If locked, do nothing more
			if (isLocked.current) return;

			// Determine direction
			const direction: Direction = event.deltaY > 0 ? "down" : "up";

			// Execute callback and lock
			triggerScroll(direction);
		},
		[triggerScroll],
	);

	// Handle keyboard navigation
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// Only handle navigation keys
			const keyNavigationMap: Record<string, Direction> = {
				ArrowDown: "down",
				ArrowUp: "up",
				PageDown: "down",
				PageUp: "up",
				Home: "up",
				End: "down",
				Space: "down", // Space typically scrolls down
			};

			const direction = keyNavigationMap[event.code];

			// If it's not a navigation key or we're locked, do nothing
			if (!direction || isLocked.current) return;

			// Prevent default for navigation keys we're handling
			event.preventDefault();

			// Execute callback and lock
			triggerScroll(direction);
		},
		[triggerScroll],
	);

	// Handle touch start
	const handleTouchStart = useCallback((event: TouchEvent) => {
		// Store the starting Y position
		touchStartY.current = event.touches[0].clientY;
	}, []);

	// Handle touch end
	const handleTouchEnd = useCallback(
		(event: TouchEvent) => {
			// If no start position or locked, do nothing
			if (touchStartY.current === null || isLocked.current) return;

			const touchEndY = event.changedTouches[0].clientY;
			const touchDistance = touchEndY - touchStartY.current;

			// Only trigger if the swipe distance is significant
			if (Math.abs(touchDistance) >= minTouchDistance) {
				const direction: Direction = touchDistance < 0 ? "down" : "up";
				triggerScroll(direction);
			}

			// Reset the touch start position
			touchStartY.current = null;
		},
		[triggerScroll],
	);

	// Handle touch move (prevent default to stop browser's native scrolling)
	const handleTouchMove = useCallback(
		(event: TouchEvent) => {
			if (enabled) {
				// Only prevent default if we're actively tracking a touch
				if (touchStartY.current !== null) {
					event.preventDefault();
				}
			}
		},
		[enabled],
	);

	useEffect(() => {
		if (!enabled || !autoCallback) return;

		const { callback, delay, repeat } = autoCallback;

		// If the user already interacted, never start
		if (userInteractedRef.current) return;

		// Schedule only if not already fired
		if (!repeat && hasFiredRef.current) return;

		autoTimerRef.current = setTimeout(() => {
			// If user interacted in the meantime, bail out
			if (userInteractedRef.current) return;

			callback("down");
			hasFiredRef.current = true;

			if (repeat) {
				// schedule next iteration
				autoTimerRef.current = null;
				// recursion only if still not interacted
				if (!userInteractedRef.current) {
					// re-enter effect logic
					setTimeout(() => {}, 0);
				}
			}
		}, delay);

		return () => {
			clearAutoTimer();
		};
	}, [enabled, autoCallback, clearAutoTimer]);

	// Effect to add/remove all event listeners
	useEffect(() => {
		// Only add listeners if the hook is enabled
		if (!enabled) {
			// Ensure cleanup if disabled while active
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				isLocked.current = false; // Reset lock state
			}
			return;
		}

		const targetElement = elementRef?.current || window;
		const documentElement = document;

		// Add wheel listener
		targetElement.addEventListener("wheel", handleWheel as EventListener, {
			passive: false,
		});

		// Add keyboard listeners if enabled
		if (enableKeyboard) {
			documentElement.addEventListener("keydown", handleKeyDown);
		}

		// Add touch listeners if enabled
		if (enableTouch) {
			targetElement.addEventListener(
				"touchstart",
				handleTouchStart as EventListener,
			);
			targetElement.addEventListener(
				"touchend",
				handleTouchEnd as EventListener,
			);
			targetElement.addEventListener(
				"touchmove",
				handleTouchMove as EventListener,
				{
					passive: false,
				},
			);
		}

		// Cleanup function
		return () => {
			// Remove wheel listener
			targetElement.removeEventListener(
				"wheel",
				handleWheel as EventListener,
			);

			// Remove keyboard listener if it was added
			if (enableKeyboard) {
				documentElement.removeEventListener("keydown", handleKeyDown);
			}

			// Remove touch listeners if they were added
			if (enableTouch) {
				targetElement.removeEventListener(
					"touchstart",
					handleTouchStart as EventListener,
				);
				targetElement.removeEventListener(
					"touchend",
					handleTouchEnd as EventListener,
				);
				targetElement.removeEventListener(
					"touchmove",
					handleTouchMove as EventListener,
				);
			}

			// Clear any pending timeout on cleanup
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Reset lock on cleanup
			isLocked.current = false;
		};
	}, [
		handleWheel,
		handleKeyDown,
		handleTouchStart,
		handleTouchEnd,
		handleTouchMove,
		elementRef,
		enabled,
		enableKeyboard,
		enableTouch,
	]);
};

export default useScrollHijack;
