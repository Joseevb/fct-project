import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ImageProps {
	file: File | Blob | null | undefined;
	altText?: string;
	className?: string;
}

// Required to convert Blob to an actual renredable image
export default function Image({ file, className }: ImageProps) {
	const [imageSrc, setImageSrc] = useState<string | null>(null);

	const baseStyles = "rounded mr-5 ml-5 w-full h-full object-cover";

	useEffect(() => {
		if (file) {
			const objectUrl = URL.createObjectURL(file);
			setImageSrc(objectUrl);

			return () => {
				URL.revokeObjectURL(objectUrl);
			};
		} else {
			// If file is null or not an image, reset imageSrc
			setImageSrc(null);
		}
	}, [file]); // Dependency array should only include 'file'

	if (!imageSrc) {
		return (
			<div className="flex items-center justify-center h-full">
				<div
					className={cn(
						baseStyles,
						className,
						`bg-gray-900/30 flex items-center justify-center`,
					)}
				>
					No Image
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center h-full">
			<img
				src={imageSrc}
				alt={"course image"}
				className={cn(baseStyles, className)}
			/>
		</div>
	);
}
