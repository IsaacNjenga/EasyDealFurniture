	export type Product = {
		_id: string;
		img: string[]; 
		name: string;
		price: number;
		discount: number;
		category?: string;
		description?: string;
		inStock?: boolean;
	};