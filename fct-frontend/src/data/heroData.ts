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
		imgAlt: "Mujer sonriendo recibiendo un masaje facial",
		buttonLabel: "Pedir Cita",
		buttonUrl: "/appointments",
		imgObjectPosition: "object-center",
	},
	{
		id: 2,
		imgSrc: heroImages[1],
		imgAlt: "Estudiante aprendiendo técnicas de masaje",
		buttonLabel: "Ver Cursos",
		buttonUrl: "/courses",
		imgObjectPosition: "object-bottom",
	},
	{
		id: 3,
		imgSrc: heroImages[2],
		imgAlt: "Variedad de productos cosméticos en estantería",
		buttonLabel: "Comprar Productos",
		buttonUrl: "/products",
		imgObjectPosition: "object-top",
	},
];
