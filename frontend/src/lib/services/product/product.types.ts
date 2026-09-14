export type Product = {
	_id: string;
	image: string[];
	name: string;
	price: number;
	discount: number;
	category?: string;
	description?: string;
	colours: string[];
	inStock?: boolean;
	isBestSeller?: boolean;
	isNewArrival?: boolean;
};

export type ProductCategory =
	| 'Office Furniture'
	| 'Kitchen Furniture'
	| 'Living Room Furniture'
	| 'Outdoor Furniture'
	| 'Second-hand Furniture'
	| 'Second-Hand Items'
	| 'Bedroom Furniture';

export type ProductListResponse = {
	webProducts: Product[];
	totalWebProducts: number;
	currentPage: number;
	totalPages: number;
};
