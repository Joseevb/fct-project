import { AboutSectionProps } from "@/components/pages/AboutPage";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

export default function HeroSection({
	ref,
	inView,
}: Readonly<AboutSectionProps>) {
	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0, y: 30 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
			transition={{ duration: 0.7, ease: "easeOut" }}
			className="text-center mb-16 space-y-6"
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={
					inView
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
				className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 font-accent"
				initial={{ opacity: 0, y: 20 }}
				animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
				transition={{ duration: 0.6, delay: 0.3 }}
			>
				sobre mí
			</motion.h1>

			<motion.p
				className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
				initial={{ opacity: 0 }}
				animate={inView ? { opacity: 1 } : { opacity: 0 }}
				transition={{ duration: 0.8, delay: 0.5 }}
			>
				Con más de 10 años de experiencia en maquillaje profesional, me
				especializo en crear looks hermosos y personalizados para cada
				ocasión. Desde maquillaje de novia hasta efectos especiales, mi
				pasión es ayudar a los clientes a sentirse seguros y hermosos en
				su propia piel.
			</motion.p>
		</motion.section>
	);
}
