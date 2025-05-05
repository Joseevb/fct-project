import { heroImages } from "@/assets/hero";

export interface HeroItemData {
	id: number | string; // Unique key for mapping
	imgSrc: string; // Will come from heroImages array
	imgAlt: string;
	buttonLabel: string;
	buttonUrl: string;
	imgObjectPosition?: string; // Optional positioning class
}

export const heroItems: HeroItemData[] = [
	{
		id: 1,
		imgSrc: heroImages[0],
		imgAlt: "Nueva Cita",
		buttonLabel: "Nueva Cita",
		buttonUrl: "/appointments",
		imgObjectPosition: "object-center",
	},
	{
		id: 2,
		imgSrc: heroImages[1],
		imgAlt: "Cursos",
		buttonLabel: "Cursos",
		buttonUrl: "/courses",
		imgObjectPosition: "object-center",
	},
	{
		id: 3,
		imgSrc: heroImages[2],
		imgAlt: "Productos",
		buttonLabel: "Productos",
		buttonUrl: "/products",
		imgObjectPosition: "object-center",
	},
];
