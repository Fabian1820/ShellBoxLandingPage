<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    delay?: number;
    children?: any;
  }

  let { delay = 0, children }: Props = $props();
  let isVisible = $state(false);
  let element: HTMLDivElement;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              isVisible = true;
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  });
</script>

<div
  bind:this={element}
  class="transition-all duration-700 {isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}"
>
  {@render children?.()}
</div>
