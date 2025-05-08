import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortfolioItem, portfolioItems } from "@/data/portfolioData";
import { User, Clock, MapPin, Sparkles } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
	// Refs for scroll animations
	const heroRef = useRef(null);
	const portfolioRef = useRef(null);
	const aboutRef = useRef(null);
	const skillsRef = useRef(null);

	// Check if sections are in view
	const heroInView = useInView(heroRef, { once: false, amount: 0.3 });
	const portfolioInView = useInView(portfolioRef, {
		once: false,
		amount: 0.2,
	});
	const aboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
	const skillsInView = useInView(skillsRef, { once: false, amount: 0.3 });

	// Skills categories
	const skillCategories = [
		{
			name: "Servicios",
			skills: [
				"Novias",
				"Eventos Especiales",
				"Editorial",
				"Clases Personales",
			],
		},
		{
			name: "Técnicas",
			skills: [
				"Maquillaje Natural",
				"Glam",
				"Efectos Especiales",
				"Airbrush",
			],
		},
	];

	return (
		<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
			{/* Hero Section with improved animation */}
			<motion.section
				ref={heroRef}
				initial={{ opacity: 0, y: 30 }}
				animate={
					heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
				}
				transition={{ duration: 0.7, ease: "easeOut" }}
				className="text-center mb-16 space-y-6"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={
						heroInView
							? { opacity: 1, scale: 1 }
							: { opacity: 0, scale: 0.95 }
					}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Badge
						variant="outline"
						className="mb-4 px-4 py-1.5 text-base font-medium"
					>
						Maquilladora Profesional
					</Badge>
				</motion.div>

				<motion.h1
					className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
					initial={{ opacity: 0, y: 20 }}
					animate={
						heroInView
							? { opacity: 1, y: 0 }
							: { opacity: 0, y: 20 }
					}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					Sobre Mí
				</motion.h1>

				<motion.p
					className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
					initial={{ opacity: 0 }}
					animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
					transition={{ duration: 0.8, delay: 0.5 }}
				>
					Con más de 10 años de experiencia en maquillaje profesional,
					me especializo en crear looks hermosos y personalizados para
					cada ocasión. Desde maquillaje de novia hasta efectos
					especiales, mi pasión es ayudar a los clientes a sentirse
					seguros y hermosos en su propia piel.
				</motion.p>
			</motion.section>

			{/* Portfolio Grid with improved card design */}
			<motion.section
				ref={portfolioRef}
				initial={{ opacity: 0 }}
				animate={portfolioInView ? { opacity: 1 } : { opacity: 0 }}
				transition={{ duration: 0.5 }}
				className="mb-24"
			>
				<h2 className="text-3xl font-bold mb-8 text-center md:text-left">
					Mi Portafolio
				</h2>

				<Tabs defaultValue="all" className="mb-8">
					<TabsList className="mx-auto flex justify-center">
						<TabsTrigger value="all">Todos</TabsTrigger>
						<TabsTrigger value="bridal">Novias</TabsTrigger>
						<TabsTrigger value="editorial">Editorial</TabsTrigger>
						<TabsTrigger value="special">Eventos</TabsTrigger>
					</TabsList>

					<TabsContent value="all" className="mt-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{portfolioItems.map((item, index) => (
								<PortfolioCard
									key={index}
									item={item}
									index={index}
									inView={portfolioInView}
								/>
							))}
						</div>
					</TabsContent>

					<TabsContent value="bridal" className="mt-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{portfolioItems
								.filter((item) => item.category === "Novia")
								.map((item, index) => (
									<PortfolioCard
										key={index}
										item={item}
										index={index}
										inView={portfolioInView}
									/>
								))}
						</div>
					</TabsContent>

					{/* Other tabs would follow the same pattern */}
				</Tabs>
			</motion.section>

			{/* About Section with improved layout */}
			<motion.section
				ref={aboutRef}
				initial={{ opacity: 0 }}
				animate={aboutInView ? { opacity: 1 } : { opacity: 0 }}
				transition={{ duration: 0.7 }}
				className="mb-20"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={
							aboutInView
								? { opacity: 1, x: 0 }
								: { opacity: 0, x: -30 }
						}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="space-y-6"
					>
						<h2 className="text-3xl font-bold mb-6">Mi Enfoque</h2>

						<p className="text-lg text-muted-foreground">
							Creo que el maquillaje debe realzar tu belleza
							natural mientras expresa tu estilo único. Mi enfoque
							combina técnicas profesionales con atención
							personalizada para crear looks que te hagan sentir
							segura y hermosa.
						</p>

						<p className="text-lg text-muted-foreground">
							Ya sea que estés preparándote para tu día de boda,
							un evento especial, o simplemente quieras aprender
							nuevas técnicas, estoy aquí para ayudarte a lograr
							el look deseado.
						</p>

						<div className="flex flex-wrap gap-3 pt-4">
							<InfoBadge
								icon={<User size={16} />}
								text="Servicio personalizado"
							/>
							<InfoBadge
								icon={<Clock size={16} />}
								text="Más de 10 años de experiencia"
							/>
							<InfoBadge
								icon={<MapPin size={16} />}
								text="Servicio a domicilio"
							/>
							<InfoBadge
								icon={<Sparkles size={16} />}
								text="Productos premium"
							/>
						</div>

						<div className="pt-4">
							<Button size="lg" className="mr-4">
								Conocer más
							</Button>
							<Button variant="outline" size="lg">
								Contactar
							</Button>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={
							aboutInView
								? { opacity: 1, scale: 1 }
								: { opacity: 0, scale: 0.9 }
						}
						transition={{ duration: 0.7, delay: 0.4 }}
						className="relative"
					>
						<div className="relative rounded-2xl overflow-hidden shadow-lg">
							<AspectRatio ratio={4 / 5} className="bg-muted">
								<img
									src="/placeholder-image.jpg"
									alt="Maquilladora profesional"
									className="object-cover w-full h-full"
								/>
							</AspectRatio>

							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
								<div className="flex items-center">
									<Avatar className="h-10 w-10 border-2 border-white">
										<AvatarImage
											src="/avatar.jpg" // TODO: Replace with your own avatar image
											alt="Maquilladora"
										/>
										<AvatarFallback>FP</AvatarFallback>
									</Avatar>
									<div className="ml-4 text-white">
										<p className="font-medium">
											Fabiana Perez
										</p>
										<p className="text-sm opacity-80">
											Maquilladora Profesional
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="absolute -bottom-6 -right-6 bg-card/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hidden md:block">
							<div className="text-lg font-medium">+500</div>
							<div className="text-sm text-muted-foreground">
								Clientes satisfechos
							</div>
						</div>
					</motion.div>
				</div>
			</motion.section>

			{/* Skills Section */}
			<motion.section
				ref={skillsRef}
				initial={{ opacity: 0, y: 20 }}
				animate={
					skillsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
				}
				transition={{ duration: 0.6 }}
				className="py-8"
			>
				<h2 className="text-3xl font-bold mb-8 text-center">
					Especialidades
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{skillCategories.map((category, categoryIndex) => (
						<Card
							key={categoryIndex}
							className="border border-primary/10"
						>
							<CardHeader>
								<CardTitle>{category.name}</CardTitle>
								<CardDescription>
									Áreas en las que me especializo
								</CardDescription>
							</CardHeader>

							<CardContent>
								<div className="flex flex-wrap gap-2">
									{category.skills.map(
										(skill, skillIndex) => (
											<motion.div
												key={skillIndex}
												initial={{ opacity: 0, y: 10 }}
												animate={
													skillsInView
														? { opacity: 1, y: 0 }
														: { opacity: 0, y: 10 }
												}
												transition={{
													duration: 0.4,
													delay: 0.1 * skillIndex,
												}}
											>
												<Badge
													variant="secondary"
													className="px-3 py-1.5 text-sm"
												>
													{skill}
												</Badge>
											</motion.div>
										),
									)}
								</div>
							</CardContent>

							<CardFooter>
								<Button variant="default" className="ml-auto">
									Ver detalles
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</motion.section>
		</div>
	);
}

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
			<Card className="overflow-hidden h-full border border-primary/10 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md pt-0">
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

interface InfoBadgeProps {
	icon: React.ReactNode;
	text: string;
}

// Info Badge Component
function InfoBadge({ icon, text }: Readonly<InfoBadgeProps>) {
	return (
		<div className="flex items-center bg-card/70 rounded-full px-4 py-1.5 text-sm font-medium">
			<span className="mr-2 text-primary">{icon}</span>
			<span>{text}</span>
		</div>
	);
}
