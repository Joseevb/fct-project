// src/hooks/useScrollHijack.ts
import Direction from "@/types/Direction";
import { useEffect, useRef, useCallback } from "react";

// Type for the callback function the hook user will provide
type ScrollCallback = (direction: Direction) => void;

interface UseScrollHijackOptions {
    /** The callback function to execute on a throttled scroll attempt. */
    callback: ScrollCallback;
    /** Milliseconds to wait before allowing the next scroll trigger. */
    throttleDelay?: number;
    /** Optional ref to the scrollable element. Defaults to window. */
    elementRef?: React.RefObject<HTMLElement>;
    /** Should the hook be active? Defaults to true */
    enabled?: boolean;
}

/**
 * A hook to intercept 'wheel' events, prevent default scroll,
 * detect direction, and trigger a throttled callback.
 */
const useScrollHijack = (options: UseScrollHijackOptions): void => {
    const {
        callback,
        throttleDelay = 700, // Default throttle delay
        elementRef,
        enabled = true, // Hook is enabled by default
    } = options;

    const isLocked = useRef<boolean>(false); // Lock ref
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Timeout ref

    // Memoize the core wheel handler logic
    const handleWheel = useCallback(
        (event: WheelEvent) => {
            // Prevent default scroll action regardless of lock, if enabled
            event.preventDefault();

            // If locked, do nothing more
            if (isLocked.current) {
                // console.log("Wheel locked - ignoring");
                return;
            }

            // Set the lock
            isLocked.current = true;
            // console.log("Wheel lock engaged");

            // Determine direction
            const direction: Direction = event.deltaY > 0 ? "down" : "up";

            // Execute the user-provided callback
            callback(direction);

            // Clear previous timeout (safety measure)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Release the lock after the throttle delay
            timeoutRef.current = setTimeout(() => {
                isLocked.current = false;
                // console.log("Wheel lock released");
            }, throttleDelay);
        },
        [callback, throttleDelay],
    ); // Dependencies: callback and throttleDelay

    // Effect to add/remove the event listener
    useEffect(() => {
        // Only add listener if the hook is enabled
        if (!enabled) {
            // Ensure cleanup if disabled while active
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                isLocked.current = false; // Reset lock state
            }
            return;
        }

        const targetElement = elementRef?.current || window;
        // console.log("Adding wheel listener");

        // Add the listener with passive: false
        targetElement.addEventListener("wheel", handleWheel as EventListener, {
            passive: false,
        });

        // Cleanup function
        return () => {
            // console.log("Removing wheel listener");
            targetElement.removeEventListener(
                "wheel",
                handleWheel as EventListener,
            );
            // Clear any pending timeout on cleanup
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            // Reset lock on cleanup just in case
            isLocked.current = false;
        };
        // Re-run effect if handler, elementRef, or enabled status changes
    }, [handleWheel, elementRef, enabled]);

    // This hook doesn't need to return anything, its job is side effects (listening and calling back)
};

export default useScrollHijack;
