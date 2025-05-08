export interface PortfolioItem {
	title: string;
	description: string;
	imageUrl: string;
	category: string;
}

export const portfolioItems: PortfolioItem[] = [
	{
		title: "Maquillaje de Novia",
		description: "Look elegante y atemporal para novias con tonos naturales y sutiles iluminaciones.",
		imageUrl: "https://picsum.photos/seed/bridal/800/800",
		category: "Novia"
	},
	{
		title: "Glam Nocturno",
		description: "Maquillaje dramático para la noche con ojos llamativos y contorno perfecto.",
		imageUrl: "https://picsum.photos/seed/evening/800/800",
		category: "Noche"
	},
	{
		title: "Belleza Natural",
		description: "Look fresco que realza los rasgos naturales con productos mínimos.",
		imageUrl: "https://picsum.photos/seed/natural/800/800",
		category: "Natural"
	},
	{
		title: "Efectos Especiales",
		description: "Maquillaje creativo y artístico para ocasiones especiales y eventos.",
		imageUrl: "https://picsum.photos/seed/special/800/800",
		category: "Efectos Especiales"
	},
	{
		title: "Look Editorial",
		description: "Estilo editorial de alta moda con colores llamativos y elementos artísticos.",
		imageUrl: "https://picsum.photos/seed/editorial/800/800",
		category: "Editorial"
	},
	{
		title: "Belleza Clásica",
		description: "Look de belleza atemporal con piel perfecta y labios rojos clásicos.",
		imageUrl: "https://picsum.photos/seed/classic/800/800",
		category: "Clásico"
	}
]; 