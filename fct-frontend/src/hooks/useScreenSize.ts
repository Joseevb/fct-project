import { useState, useEffect, useRef } from "react";

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export const useScreenSize = (): ScreenSize => {
	const [screenSize, setScreenSize] = useState<ScreenSize>("md");
	const resizeObserverRef = useRef<ResizeObserver>(null);

	useEffect(() => {
		const getSize = (width: number): ScreenSize =>
			width < 640
				? "xs"
				: width < 768
					? "sm"
					: width < 1024
						? "md"
						: width < 1280
							? "lg"
							: width < 1536
								? "xl"
								: "2xl";

		resizeObserverRef.current = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setScreenSize(getSize(entry.contentRect.width));
			}
		});

		resizeObserverRef.current.observe(document.body);

		return () => {
			resizeObserverRef.current?.disconnect();
		};
	}, []);

	return screenSize;
};
