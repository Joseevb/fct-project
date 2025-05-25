import AboutSection from "@/components/ui/about/AboutSection";
import HeroSection from "@/components/ui/about/HeroSection";
import PortfolioSection from "@/components/ui/about/PortfolioSection";
import SkillsSection from "@/components/ui/about/SkillsSection";
import { useInView } from "framer-motion";
import { RefObject, useRef } from "react";

export interface SkillCategory {
	name: string;
	skills: string[];
}
export interface AboutSectionProps {
	ref: RefObject<HTMLDivElement | null>;
	inView: boolean;
}

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
	const skillCategories: SkillCategory[] = [
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
			<HeroSection ref={heroRef} inView={heroInView} />

			{/* Portfolio Grid with improved card design */}
			<PortfolioSection ref={portfolioRef} inView={portfolioInView} />

			{/* About Section with improved layout */}
			<AboutSection ref={aboutRef} inView={aboutInView} />

			{/* Skills Section */}
			<SkillsSection
				ref={skillsRef}
				inView={skillsInView}
				skillCategories={skillCategories}
			/>
		</div>
	);
}
