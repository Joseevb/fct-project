import { Calendar, GraduationCap, ShoppingBag } from "lucide-react";
import { heroItems } from "@/data/heroData";
import { Link } from "react-router-dom";

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
							className="flex-1 bg-card/70 rounded-lg shadow-md p-6 flex flex-col items-center transition-all hover:shadow-lg"
						>
							<div className="mb-4">
								{getIcon(item.buttonUrl)}
							</div>
							<h2 className="text-2xl font-semibold mb-3">
								{item.buttonLabel}
							</h2>
							<p className="text-foreground text-center mb-6">
								{item.description}
							</p>
							<div className="mt-auto">
								<Link
									to={item.buttonUrl}
									className="px-6 py-2 bg-primary text-accent-foreground rounded-md hover:bg-primary/90 transition-colors"
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
