import { AboutSectionProps } from "@/components/pages/AboutPage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioItem, portfolioItems } from "@/data/portfolioData";
import { motion } from "motion/react";
import { useMemo } from "react";

interface PortfolioCardProps {
	item: PortfolioItem;
	index: number;
	inView: boolean;
}

// Portfolio Card Component
function PortfolioCard({ item, index, inView }: Readonly<PortfolioCardProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			whileHover={{ y: -8, transition: { duration: 0.2 } }}
			className="h-full"
		>
			<Card className="overflow-hidden h-full border border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-md dark:shadow-accent/10 hover:shadow-lg pt-0">
				<div className="relative">
					<AspectRatio ratio={1 / 1}>
						<img
							src={item.imageUrl}
							alt={item.title}
							className="object-cover w-full h-full"
						/>
					</AspectRatio>

					<div className="absolute top-3 right-3">
						<Badge className="bg-accent/20 hover:bg-accent/60 transition-all duration-300">
							{item.category}
						</Badge>
					</div>
				</div>

				<CardHeader>
					<CardTitle className="text-xl">{item.title}</CardTitle>
					<CardDescription className="line-clamp-2">
						{item.description}
					</CardDescription>
				</CardHeader>

				<CardFooter className="flex justify-between">
					<Button variant="hero">Ver detalles</Button>
				</CardFooter>
			</Card>
		</motion.div>
	);
}

export default function PortfolioSection({
	ref,
	inView,
}: Readonly<AboutSectionProps>) {
	const uniqueCategories = useMemo(() => {
		const categories = portfolioItems.map((item) => item.category);
		const unique = [...new Set(categories)];
		return unique;
	}, []);

	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0 }}
			animate={inView ? { opacity: 1 } : { opacity: 0 }}
			transition={{ duration: 0.5 }}
			className="mb-24"
		>
			<h2 className="text-3xl font-bold mb-8 text-center md:text-left">
				Mi Portafolio
			</h2>

			<Tabs defaultValue="all" className="mb-8">
				<TabsList className="mx-auto flex justify-center">
					<TabsTrigger value="all">Todos</TabsTrigger>

					{uniqueCategories.map((category) => (
						<TabsTrigger
							value={category.toLowerCase().replace(/\s+/g, "-")}
							key={category}
						>
							{category}
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="all" className="mt-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{portfolioItems.map((item, index) => (
							<PortfolioCard
								key={index}
								item={item}
								index={index}
								inView={inView}
							/>
						))}
					</div>
				</TabsContent>

				{uniqueCategories.map((category) => (
					<TabsContent
						value={category.toLowerCase().replace(/\s+/g, "-")}
						key={category}
						className="mt-6"
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{portfolioItems
								.filter((item) => item.category === category)
								.map((item, index) => (
									<PortfolioCard
										key={index}
										item={item}
										index={index}
										inView={inView}
									/>
								))}
						</div>
					</TabsContent>
				))}
			</Tabs>
		</motion.section>
	);
}
