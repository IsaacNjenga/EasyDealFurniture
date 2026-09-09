import type { Pathname } from '$app/types';

export type NavigationItem = {
	title: string;
	href: Pathname;
};

export const navigationItems: NavigationItem[] = [
	{
		title: 'Home',
		href: '/home'
	},
	{
		title: 'Shop',
		href: '/shop'
	},
	{
		title: 'Contact',
		href: '/contact'
	},
	// {
	// 	title: 'FAQs',
	// 	href: '/faqs'
	// },
	{
		title: 'My Wishlist',
		href: '/wishlist'
	}
];
