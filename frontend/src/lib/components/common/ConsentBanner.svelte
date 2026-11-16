
<script lang="ts">
  import { onMount } from 'svelte';
  import {
    getAnalyticsConsent,
    updateAnalyticsConsent
  } from '$lib/consent';

  let visible = $state(false);
  let loading = $state(false);
  let errorMessage = $state('');

  onMount(() => {
    visible = getAnalyticsConsent() === null;
  });

  async function chooseConsent(choice: 'accepted' | 'rejected') {
    if (loading) return;

    loading = true;
    errorMessage = '';

    try {
      await updateAnalyticsConsent(choice);
      visible = false;
    } catch (error) {
      console.error('Analytics consent update failed:', error);

      errorMessage =
        choice === 'rejected'
          ? 'Analytics is disabled in this browser, but we could not confirm the preference with our server. Please try again.'
          : 'We could not save your preference. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

{#if visible}
  <div
    class="dark:border-foreground-700 fixed right-1 bottom-1 left-1 z-1000 m-auto h-auto w-[900px] max-w-[calc(100%-0.5rem)] rounded-md border bg-background p-2 dark:bg-background"
  >
    <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h3 class="m-1 font-bold text-primary">
          Help us improve your experience
        </h3>

        <p class="m-1 text-muted-foreground">
          We use optional analytics to understand how visitors interact
          with our website and improve your browsing experience.
        </p>

        {#if errorMessage}
          <p class="m-1 text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        {/if}
      </div>

      <div class="m-2 flex shrink-0 gap-2 sm:justify-end">
        <button
          class="cursor-pointer rounded-sm bg-primary px-4 py-2 font-bold text-background disabled:cursor-not-allowed disabled:opacity-50"
          onclick={() => chooseConsent('accepted')}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Accept'}
        </button>

        <button
          class="cursor-pointer rounded-sm bg-white px-4 py-2 font-bold text-primary dark:bg-foreground dark:text-background disabled:cursor-not-allowed disabled:opacity-50"
          onclick={() => chooseConsent('rejected')}
          disabled={loading}
        >
          Reject
        </button>
      </div>
    </div>
  </div>
{/if}
