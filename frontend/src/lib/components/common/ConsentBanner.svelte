<script lang="ts">
	import { onMount } from 'svelte';
	import { getAnalyticsConsent, saveAnalyticsConsent } from '$lib/consent';

	let visible = $state(false);

	onMount(() => {
		visible = getAnalyticsConsent() === null;
	});

	function chooseConsent(choice: 'accepted' | 'rejected') {
		saveAnalyticsConsent(choice);
		visible = false;
	}
</script>

{#if visible}
	<div class="consent-banner bg-background dark:bg-background border dark:border-foreground-700">
		<div class="consent-content">
			<div>
				<h3 class='text-primary font-bold'>Help us improve your experience</h3>
				<p class='text-muted-foreground'>
					We use optional analytics to understand how visitors interact with our website and improve
					your browsing experience.
				</p>
			</div>

			<div class="consent-actions">
				<button class="reject-button" onclick={() => chooseConsent('rejected')}> Reject </button>

				<button class="accept-button" onclick={() => chooseConsent('accepted')}> Accept </button>
			</div>
		</div>
	</div>
{/if}

<style>
	.consent-banner {
		position: fixed;
		z-index: 1000;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
		max-width: 900px;
		margin: 0 auto;
		padding: 1.25rem;
		color: #222;
		/* border: 1px solid #ddd; */
		border-radius: 12px;
		box-shadow: 0 8px 30px rgb(0 0 0 / 15%);
	}

	.consent-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.5rem;
	}

	h3 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.consent-actions {
		display: flex;
		gap: 0.5rem;
		flex-shrink: 0;
	}

	button {
		padding: 0.7rem 1rem;
		border-radius: 7px;
		cursor: pointer;
		font-weight: 600;
	}

	.reject-button {
		background: white;
		border: 1px solid #ccc;
		color: #222;
	}

	.accept-button {
		background: #222;
		border: 1px solid #222;
		color: white;
	}

	@media (max-width: 650px) {
		.consent-content {
			flex-direction: column;
			align-items: stretch;
		}

		.consent-actions {
			flex-direction: column-reverse;
		}
	}
</style>
