import { heroImages } from "@/assets/hero";

export interface HeroItemData {
	id: number | string; // Unique key for mapping
	imgSrc: string; // Will come from heroImages array
	imgAlt: string;
	buttonLabel: string;
	buttonUrl: string;
	imgObjectPosition?: string; // Optional positioning class
	description: string;
}

export const heroItems: HeroItemData[] = [
	{
		id: 1,
		imgSrc: heroImages[0],
		imgAlt: "Nueva Cita",
		buttonLabel: "Nueva Cita",
		buttonUrl: "/appointments",
		imgObjectPosition: "object-center",
		description:
			"Reserve su cita para servicios de maquillaje con nuestro equipo profesional.",
	},
	{
		id: 2,
		imgSrc: heroImages[1],
		imgAlt: "Cursos",
		buttonLabel: "Cursos",
		buttonUrl: "/courses",
		imgObjectPosition: "object-center",
		description:
			"Aprenda técnicas de maquillaje con nuestros cursos especializados.",
	},
	{
		id: 3,
		imgSrc: heroImages[2],
		imgAlt: "Productos",
		buttonLabel: "Productos",
		buttonUrl: "/products",
		imgObjectPosition: "object-center",
		description:
			"Descubra nuestra selección de productos de maquillaje de alta calidad.",
	},
];
