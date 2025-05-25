import portfolioImages from "@/assets/portfolio";

export interface PortfolioItem {
	title: string;
	description: string;
	imageUrl: string; // This will store the imported image path/URL
	category: string;
	date?: string;
	location?: string;
	services?: string[];
	price?: number;
}

// Define the raw data structure, using a key to link to the images
interface RawPortfolioItem {
	title: string;
	description: string;
	imageKey: keyof typeof portfolioImages; // Use the keys of portfolioImages as a type
	category: string;
	date?: string;
	location?: string;
	services?: string[];
	price?: number;
}

const rawPortfolioItems: RawPortfolioItem[] = [
	{
		title: "Maquillaje de Novia",
		description:
			"Look elegante y atemporal para novias con tonos naturales y sutiles iluminaciones.",
		imageKey: "bridal", // Use the key from portfolioImages
		category: "Novia",
		price: 120,
	},
	{
		title: "Glam Nocturno",
		description:
			"Maquillaje dramático para la noche con ojos llamativos y contorno perfecto.",
		imageKey: "evening", // Use the key from portfolioImages
		category: "Noche",
		price: 150,
	},
	// Add the other raw items with their corresponding imageKeys
	{
		title: "Belleza Natural",
		description:
			"Look fresco que realza los rasgos naturales con productos mínimos.",
		imageKey: "natural", // Use the key from portfolioImages
		category: "Natural",
		price: 100,
	},
	{
		title: "Efectos Especiales",
		description:
			"Maquillaje creativo y artístico para ocasiones especiales y eventos.",
		imageKey: "special", // Use the key from portfolioImages
		category: "Efectos Especiales",
		price: 130,
	},
	{
		title: "Look Editorial",
		description:
			"Estilo editorial de alta moda con colores llamativos y elementos artísticos.",
		imageKey: "editorial", // Use the key from portfolioImages
		category: "Editorial",
		price: 140,
	},
	{
		title: "Belleza Clásica",
		description:
			"Look de belleza atemporal con piel perfecta y labios rojos clásicos.",
		imageKey: "classic", // Use the key from portfolioImages
		category: "Clásico",
		price: 110,
	},
];

// Map the raw data to the final PortfolioItem structure
export const portfolioItems: PortfolioItem[] = rawPortfolioItems.map(
	(item) => ({
		...item, // Spread the existing properties
		imageUrl: portfolioImages[item.imageKey], // Replace imageKey with the actual imageUrl from the imported object
	}),
);

