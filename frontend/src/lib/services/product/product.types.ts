export type CatalogPricing = {
	currency: string;
	basePrice: number;
	compareAtPrice: number | null;
};

export type CatalogCategory = {
	_id: string;
	name: string;
	slug: string;
	image?: string;
};

export type CatalogMerchandising = {
	isFeatured: boolean;
	isBestSeller: boolean;
	isNewArrival: boolean;
	sortOrder: number;
};

export type CatalogSEO = {
	metaTitle?: string;
	metaDescription?: string;
};

export type Product = {
	_id: string;
	images: string[];
	name: string;
	pricing: CatalogPricing;
	discount: number;
	category: CatalogCategory;
	description?: string;
	colours: string[];
	keyFeatures: string[];
	tags: string[];
	merchandising: CatalogMerchandising;
	slug: string;
	seo: CatalogSEO;
};

export type ProductCategory =
	| 'Office Furniture'
	| 'Kitchen Furniture'
	| 'Living Room Furniture'
	| 'Outdoor Furniture'
	| 'Second-hand Furniture'
	| 'Bedroom Furniture';

export type ProductListResponse = {
	catalog: Product[];
	totalCatalog: number;
	currentPage: number;
	totalPages: number;
};

export type AllProductsResponse = {
	catalog: Product[];
};

export type SlugProductResponse = {
	slugProduct: Product;
};
