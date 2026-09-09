import type { Product } from '$lib/types/product.types';

export const bestSellingProducts: Product[] = [
    {
        _id: '65f1a2b3c4d5e6f7a8b90001',
        name: 'Nordic Minimalist Oak Dining Table',
        price: 45000,
        discount: 15, // Discounted to ~38,250
        category: 'Dining',
        description: 'Crafted from solid Scandinavian oak, this 6-seater dining table brings timeless elegance and durability to modern dining spaces. Treated with natural oil finish.',
        inStock: true,
        img: [
            'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1000&q=80'
        ]
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b90002',
        name: 'Velvet Ergonomic Accent Lounge Chair',
        price: 28500,
        discount: 10,
        category: 'Living Room',
        description: 'Plush velvet upholstery paired with matte black steel legs. Features deep cushioning and ergonomic lumbar support for extended relaxation.',
        inStock: true,
        img: [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1000&q=80'
        ]
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b90003',
        name: 'Modular Sectional L-Shape Sofa',
        price: 85000,
        discount: 20,
        category: 'Living Room',
        description: 'Versatile modular sofa with stain-resistant fabric. Can be reconfigured to fit left-hand or right-hand room layouts with ease.',
        inStock: true,
        img: [
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80'
        ]
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b90004',
        name: 'Industrial Metal & Walnut Bookshelf',
        price: 22000,
        discount: 0,
        category: 'Office',
        description: '5-tier open bookshelf made with powder-coated iron frame and thick walnut veneer boards. Perfect for home offices or display rooms.',
        inStock: true,
        img: [
            'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=1000&q=80'
        ]
    }
];

export const freshDesignProducts: Product[] = [
    {
        _id: '65f1a2b3c4d5e6f7a8b90005',
        name: 'Curved Bouclé Cream Armchair',
        price: 34000,
        discount: 5,
        category: 'Living Room',
        description: 'Organic curved architecture wrapped in rich textured cream bouclé fabric. A trending contemporary showpiece for modern interiors.',
        inStock: true,
        img: [
            'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1000&q=80'
        ]
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b90006',
        name: 'Japandi Floating Bed Frame with Headboard',
        price: 62000,
        discount: 12,
        category: 'Bedroom',
        description: 'Combines Japanese minimalism with Scandinavian functionality. Built-in floating side tables and soft ambient headboard backlighting.',
        inStock: true,
        img: [
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80',
        ]
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b90007',
        name: 'Fluted Marble Coffee Table',
        price: 29500,
        discount: 0,
        category: 'Living Room',
        description: 'Genuine Carrara white marble top supported by a solid oak fluted cylinder pedestal base.',
        inStock: true,
        img: [
            'https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'
        ]
    },
    {
        _id: '65f1a2b3c4d5e6f7a8b90008',
        name: 'Rattan & Teak Ergonomic Office Desk',
        price: 38000,
        discount: 8,
        category: 'Office',
        description: 'Handcrafted teak wood desk featuring natural cane rattan drawer panels and integrated cable management routing.',
        inStock: false,
        img: [
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
        ]
    }
];