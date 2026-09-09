<script lang="ts">
	import { onMount } from 'svelte';
	import { Navigation } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import Cookies from 'universal-cookie';

	type Props = {
		storeLat: number;
		storeLng: number;
	};

	let { storeLat, storeLng }: Props = $props();

	const cookies = new Cookies();
	let mapElement: HTMLDivElement;
	let map: any;
	let L: any;
	let userLocation = $state<{ lat: number; lng: number } | null>(null);
	let isLocating = $state(false);
	let routeControl: any;

	// Helper: Draw route and fit bounds
	const drawRoute = (userLat: number, userLng: number) => {
		if (!map || !L) return;

		if (routeControl) {
			map.removeControl(routeControl);
		}

		// Add user marker
		const userIcon = L.divIcon({
			html: `<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg border-2 border-white ring-4 ring-blue-500/30"><div class="h-2.5 w-2.5 rounded-full bg-white"></div></div>`,
			className: 'custom-user-pin',
			iconSize: [32, 32],
			iconAnchor: [16, 16]
		});

		L.marker([userLat, userLng], { icon: userIcon }).addTo(map).bindPopup('Your Location');

		// Draw path using Routing Engine
		routeControl = (L as any).Routing.control({
			waypoints: [L.latLng(userLat, userLng), L.latLng(storeLat, storeLng)],
			lineOptions: {
				styles: [{ color: '#fea549', weight: 5, opacity: 0.9 }]
			},
			createMarker: () => null, // Suppress default routing markers
			addWaypoints: false,
			draggableWaypoints: false
			// show: false // Hide turn-by-turn instruction panel
		}).addTo(map);

		// Fit map bounds to show full route
		const bounds = L.latLngBounds([
			[userLat, userLng],
			[storeLat, storeLng]
		]);
		map.fitBounds(bounds, { padding: [60, 60] });
	};

	onMount(async () => {
		// Dynamically import Leaflet
		L = (await import('leaflet')).default;
		await import('leaflet-routing-machine');

		// Leaflet CSS Injection
		if (!document.getElementById('leaflet-css')) {
			const link = document.createElement('link');
			link.id = 'leaflet-css';
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);
		}

		// Initialize Map
		map = L.map(mapElement).setView([storeLat, storeLng], 15);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

		// Store Custom Pin
		const storeIcon = L.divIcon({
			html: `<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl border-2 border-white"><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>`,
			className: 'custom-store-pin',
			iconSize: [40, 40],
			iconAnchor: [20, 40]
		});

		L.marker([storeLat, storeLng], { icon: storeIcon })
			.addTo(map)
			.bindPopup('EasyDeal Furniture - Ngara Road');

		// Check for existing location cookie
		const savedLocation = cookies.get('user_location');
		if (savedLocation?.lat && savedLocation?.lng) {
			userLocation = savedLocation;
			drawRoute(savedLocation.lat, savedLocation.lng);
		}
	});

	const fetchAndSaveDirections = () => {
		if (!navigator.geolocation) {
			toast.warning('Geolocation is not supported by your browser.');
			return;
		}

		isLocating = true;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				const locData = { lat: latitude, lng: longitude };

				userLocation = locData;
				isLocating = false;

				// Save location in cookie (Expires in 30 days)
				cookies.set('user_location', JSON.stringify(locData), {
					path: '/',
					maxAge: 30 * 24 * 60 * 60,
					sameSite: 'lax'
				});

				drawRoute(latitude, longitude);
				toast.success('Route updated and saved.');
			},
			(error) => {
				isLocating = false;
				toast.warning('Unable to retrieve location. Please enable location permissions.');
				console.error(error);
			}
		);
	};
</script>

<div class="relative h-full overflow-hidden rounded-md border border-border bg-card shadow-lg">
	<div class="absolute top-4 right-4 z-1000">
		<Button
			onclick={fetchAndSaveDirections}
			disabled={isLocating}
			class="gap-2 rounded-full bg-slate-900 font-semibold text-white shadow-md hover:bg-primary hover:text-primary-foreground dark:bg-slate-100 dark:text-slate-900"
		>
			<Navigation class="h-4 w-4 {isLocating ? 'animate-spin' : ''}" />
			{isLocating
				? 'Locating...'
				: userLocation
					? 'Recalculate Directions'
					: 'Get Directions from My Location'}
		</Button>
	</div>

	<!-- Map Canvas Container -->
	<div bind:this={mapElement} class="h-120 w-full"></div>
</div>
