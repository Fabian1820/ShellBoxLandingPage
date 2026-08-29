<script lang="ts">
  import { onMount } from 'svelte';
  import { whatsappLink } from '../lib/config';

  interface Props {
    /** Ruta activa, para marcar el enlace correspondiente. */
    actual?: string;
  }

  let { actual = '/' }: Props = $props();

  let desplazado = $state(false);
  let menuAbierto = $state(false);
  let oscuro = $state(false);

  const enlaces = [
    { href: '/', texto: 'Inicio' },
    { href: '/#tarifas', texto: 'Tarifas' },
    { href: '/#como-funciona', texto: '¿Cómo funciona?' },
    { href: '/stock', texto: 'Stock en Cuba' },
    { href: '/terminos', texto: 'Términos' },
  ];

  const cta = whatsappLink(
    '¡Hola ShellBox! Quiero hacer un encargo desde Estados Unidos.'
  );

  onMount(() => {
    oscuro = document.documentElement.classList.contains('dark');

    const alHacerScroll = () => {
      desplazado = window.scrollY > 16;
    };
    alHacerScroll();
    window.addEventListener('scroll', alHacerScroll, { passive: true });
    return () => window.removeEventListener('scroll', alHacerScroll);
  });

  function alternarTema() {
    oscuro = !oscuro;
    document.documentElement.classList.toggle('dark', oscuro);
    try {
      localStorage.setItem('theme', oscuro ? 'dark' : 'light');
    } catch {
      /* Sin almacenamiento el tema dura solo esta visita. */
    }
  }

  function esActivo(href: string) {
    return href.startsWith('/#') ? false : href === actual;
  }
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && (menuAbierto = false)} />

<header
  class="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
  style={desplazado
    ? 'background-color: color-mix(in srgb, var(--bg) 82%, transparent); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border);'
    : 'background-color: transparent; border-bottom: 1px solid transparent;'}
>
  <nav class="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
    <div class="flex h-[4.5rem] items-center justify-between">
      <a href="/" class="group flex items-center gap-3" aria-label="ShellBox Encargos, inicio">
        <span
          class="inline-flex rounded-xl bg-white p-1.5 transition-transform duration-300 group-hover:scale-105"
        >
          <img src="/shellboxlogo.jpg" alt="" class="h-9 w-auto" />
        </span>
      </a>

      <div class="hidden items-center gap-1 md:flex">
        {#each enlaces as enlace}
          <a
            href={enlace.href}
            class="relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
            style="color: {esActivo(enlace.href) ? 'var(--text)' : 'var(--text-muted)'}"
            onmouseenter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onmouseleave={(e) =>
              (e.currentTarget.style.color = esActivo(enlace.href)
                ? 'var(--text)'
                : 'var(--text-muted)')}
          >
            {enlace.texto}
            {#if esActivo(enlace.href)}
              <span
                class="bg-gradient-brand absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full"
              ></span>
            {/if}
          </a>
        {/each}

        <button
          onclick={alternarTema}
          class="ml-2 rounded-lg p-2.5 transition-colors"
          style="color: var(--text-muted)"
          aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={oscuro ? 'Modo claro' : 'Modo oscuro'}
        >
          {#if oscuro}
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          {:else}
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          {/if}
        </button>

        <a href={cta} target="_blank" rel="noopener noreferrer" class="btn-primary ml-2 !px-5 !py-2.5 text-sm">
          Cotizar mi carrito
        </a>
      </div>

      <div class="flex items-center gap-1 md:hidden">
        <button
          onclick={alternarTema}
          class="rounded-lg p-2.5"
          style="color: var(--text-muted)"
          aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {#if oscuro}
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          {:else}
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          {/if}
        </button>

        <button
          onclick={() => (menuAbierto = !menuAbierto)}
          class="rounded-lg p-2.5"
          style="color: var(--text-muted)"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.6">
            {#if menuAbierto}
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            {/if}
          </svg>
        </button>
      </div>
    </div>

    {#if menuAbierto}
      <div
        class="pb-5 md:hidden"
        style="border-top: 1px solid var(--border); background-color: color-mix(in srgb, var(--bg) 95%, transparent);"
      >
        <div class="flex flex-col gap-1 pt-4">
          {#each enlaces as enlace}
            <a
              href={enlace.href}
              onclick={() => (menuAbierto = false)}
              class="rounded-lg px-3 py-2.5 text-sm font-medium"
              style="color: {esActivo(enlace.href) ? 'var(--text)' : 'var(--text-muted)'}"
            >
              {enlace.texto}
            </a>
          {/each}
          <a
            href={cta}
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary mt-3 w-full text-sm"
          >
            Cotizar mi carrito
          </a>
        </div>
      </div>
    {/if}
  </nav>
</header>
