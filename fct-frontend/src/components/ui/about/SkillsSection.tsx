import { AboutSectionProps, SkillCategory } from "@/components/pages/AboutPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { motion } from "motion/react";
import { TypographyH2 } from "../typography";

export default function SkillsSection({
	ref,
	inView,
	skillCategories,
}: Readonly<AboutSectionProps & { skillCategories: SkillCategory[] }>) {
	return (
		<motion.section
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.6 }}
			className="py-8"
		>
			<TypographyH2 className="text-3xl font-bold font-accent mb-8 text-center border-b-0">
				Especialidades
			</TypographyH2>

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
								{category.skills.map((skill, skillIndex) => (
									<motion.div
										key={skillIndex}
										initial={{ opacity: 0, y: 10 }}
										animate={
											inView
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
								))}
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
	);
}
