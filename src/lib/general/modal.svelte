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
      class="relative z-50 w-full max-w-lg rounded-2xl bg-white px-6 pt-6 pb-2 border-1 border-[#EBEBE8]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <div class="mb-4 flex items-center justify-between border-b border-[#ebebeb] pb-4">
        <!-- header -->
        {#if title}
            <h2 id="modal-title" class=" flex items-center gap-3 text-lg font-bold text-[#443C68]">{title}</h2>
        {/if}
        <!-- close button -->
        <button class="ml-auto rounded-full p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer transition-colors duration-200 ease-in-out"
          on:click={closeModal}
          aria-label="close modal" >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#818181" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
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
