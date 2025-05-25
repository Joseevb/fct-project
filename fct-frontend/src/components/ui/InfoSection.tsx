import { Calendar, GraduationCap, ShoppingBag } from "lucide-react";
import { heroItems } from "@/data/heroData";
import { Link } from "react-router-dom";
import { TypographyH3 } from "./typography";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

export default function InfoSection() {
	// Map icons to each item type
	const getIcon = (buttonUrl: string) => {
		if (buttonUrl.includes("appointments"))
			return <Calendar className="h-10 w-10 text-primary" />;
		if (buttonUrl.includes("courses"))
			return <GraduationCap className="h-10 w-10 text-primary" />;
		if (buttonUrl.includes("products"))
			return <ShoppingBag className="h-10 w-10 text-primary" />;
		return null;
	};

	return (
		<div className="w-full px-4 bg-background">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row gap-8 items-stretch justify-center">
					{heroItems.map((item) => (
						<div
							key={item.id}
							className="flex-1 bg-card/70 rounded-lg border-primary/10 hover:border-primary/30 shadow-md dark:shadow-accent/10 hover:shadow-lg p-6 flex flex-col items-center transition-all duration-300"
						>
							<div className="mb-4">
								{getIcon(item.buttonUrl)}
							</div>
							<TypographyH3>{item.buttonLabel}</TypographyH3>
							<p className="text-foreground text-center mb-6">
								{item.description}
							</p>
							<div className="mt-auto">
								<Link
									to={item.buttonUrl}
									className={cn(
										buttonVariants({ variant: "default" }),
									)}
								>
									{item.buttonLabel}
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
