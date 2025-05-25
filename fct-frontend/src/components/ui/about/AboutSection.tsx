import { AboutSectionProps } from "@/components/pages/AboutPage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Sparkles, User } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { TypographyH2 } from "../typography";
import AboutImage from "@/assets/about.jpg";

export default function AboutSection({
	ref,
	inView,
}: Readonly<AboutSectionProps>) {
	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0 }}
			animate={inView ? { opacity: 1 } : { opacity: 0 }}
			transition={{ duration: 0.7 }}
			className="mb-20"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					animate={
						inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
					}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="space-y-6"
				>
					<TypographyH2 className="text-3xl font-bold font-accent mb-6 border-b-0">
						Mi enfoque
					</TypographyH2>

					<p className="text-lg text-muted-foreground">
						Creo que el maquillaje debe realzar tu belleza natural
						mientras expresa tu estilo único. Mi enfoque combina
						técnicas profesionales con atención personalizada para
						crear looks que te hagan sentir segura y hermosa.
					</p>

					<p className="text-lg text-muted-foreground">
						Ya sea que estés preparándote para tu día de boda, un
						evento especial, o simplemente quieras aprender nuevas
						técnicas, estoy aquí para ayudarte a lograr el look
						deseado.
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
						<Link
							to={
								"https://www.instagram.com/fabianaperezmua?igsh=aHVxZGpmbmVmc3Fx"
							}
							className={cn(
								buttonVariants({
									variant: "default",
								}),
								"mr-4",
							)}
						>
							Conocer más
						</Link>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={
						inView
							? { opacity: 1, scale: 1 }
							: { opacity: 0, scale: 0.9 }
					}
					transition={{ duration: 0.7, delay: 0.4 }}
					className="relative"
				>
					<div className="relative rounded-2xl overflow-hidden shadow-lg">
						<AspectRatio ratio={4 / 5} className="bg-muted">
							<img
								src={AboutImage}
								alt="Maquilladora profesional"
								className="object-cover object-left w-full h-full"
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
									<p className="font-medium">Fabiana Perez</p>
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
