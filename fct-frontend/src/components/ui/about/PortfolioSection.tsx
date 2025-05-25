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
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { TypographyH2, TypographyList } from "../typography";

interface PortfolioCardProps {
	item: PortfolioItem;
	index: number;
	inView: boolean;
}

// Portfolio Card Component
function PortfolioCard({ item, index, inView }: Readonly<PortfolioCardProps>) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<>
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
							<Badge className="bg-accent/70 hover:bg-accent/90 text-foreground transition-all duration-300">
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
						<Button
							variant="hero"
							onClick={() => setIsExpanded(true)}
						>
							Ver detalles
						</Button>
					</CardFooter>
				</Card>
			</motion.div>

			<AnimatePresence>
				{isExpanded && (
					<>
						{/* Overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/60 z-50"
							onClick={() => setIsExpanded(false)}
						/>

						{/* Expanded Card */}
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{ duration: 0.3 }}
							className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-xl z-50"
						>
							<div className="relative">
								<Button
									variant="ghost"
									size="icon"
									className="absolute top-4 right-4 z-10"
									onClick={() => setIsExpanded(false)}
								>
									<X className="h-6 w-6" />
								</Button>

								<div className="grid md:grid-cols-2 gap-6 p-6">
									<AspectRatio ratio={1 / 1}>
										<img
											src={item.imageUrl}
											alt={item.title}
											className="object-cover w-full h-full rounded-lg"
										/>
									</AspectRatio>

									<div className="flex flex-col h-full">
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.2 }}
										>
											<h3 className="text-2xl font-bold">
												{item.title}
											</h3>
											<Badge className="mt-2">
												{item.category}
											</Badge>
										</motion.div>

										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
											className="flex flex-col flex-grow pt-4 justify-between"
										>
											<p className="text-muted-foreground">
												{item.description}
											</p>
											{/* Add more detailed content here */}
											<div className="mb-5 ml-auto mr-10">
												<h4 className="font-semibold mb-2">
													Detalles adicionales:
												</h4>
												<TypographyList>
													<li>
														Precio: ${item.price}
													</li>
												</TypographyList>
											</div>
										</motion.div>
									</div>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
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
			<TypographyH2 className="mb-10 font-accent">
				Mi portafolio
			</TypographyH2>

			<Tabs defaultValue="all" className="mb-8">
				<div className="w-full overflow-x-auto pb-2">
					<TabsList className="flex items-center justify-start space-x-1">
						<TabsTrigger
							value="all"
							className="whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
						>
							Todos
						</TabsTrigger>

						{uniqueCategories.map((category) => (
							<TabsTrigger
								value={category
									.toLowerCase()
									.replace(/\s+/g, "-")}
								key={category}
								className="whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all duration-200"
							>
								{category}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

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
