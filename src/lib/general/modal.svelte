<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { createEventDispatcher } from "svelte";

  export let isOpen = false;
  export let title: string = "";
  export let closeOnBackdrop = true;

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch("close");
  }

  function handleBackdropClick(event: MouseEvent) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      closeModal();
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center"
    on:click={handleBackdropClick}
    on:keydown={handleKeydown}
  >
    <!-- backdrop -->
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div
      class="fixed inset-0 bg-black opacity-50"
      transition:fade={{ duration: 200 }}
    />

    <!-- modal -->
    <div
      class="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <div class="mb-4 flex items-center justify-between">
        <!-- header -->
        {#if title}
          <h2 id="modal-title" class="text-xl font-semibold">{title}</h2>
        {/if}
        <!-- close button -->
        <button
          class="ml-auto rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          on:click={closeModal}
          aria-label="Close modal"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- cntent -->
      <div class="modal-content">
        <slot />
      </div>

      <!-- footer -->
      <div class="mt-4">
        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}
