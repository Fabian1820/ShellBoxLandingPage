<script lang="ts">
  let isVisible = $state(false);

  if (typeof window !== 'undefined') {
    setTimeout(() => {
      isVisible = true;
    }, 100);
  }
</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
  <!-- Subtle Background Gradient - Más suave, estilo Apple -->
  <div class="absolute inset-0 bg-gradient-to-b from-orange-50/30 via-white to-white"></div>

  <div class="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-32">
    <div class="text-center space-y-12">
      <!-- Main Heading - Jerarquía súper marcada -->
      <div class="space-y-6 {isVisible ? 'animate-fadeInUp' : 'opacity-0'}">
        <h1 class="text-6xl md:text-8xl font-semibold leading-[1.05] tracking-tight text-gray-900">
          Todo lo que te gusta,
          <br />
          <span class="text-orange-500">más cerca</span>
        </h1>
      </div>

      <!-- Subtitle - Tipografía ligera y espaciada -->
      <p class="text-xl md:text-2xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed {isVisible ? 'animate-fadeInUp' : 'opacity-0'}" style="animation-delay: 0.15s;">
        Envíos de Shein desde España a Cuba.
        <br />
        Precio transparente al momento, sin sorpresas.
      </p>

      <!-- CTA Buttons - Acción principal clara, secundaria discreta -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 {isVisible ? 'animate-fadeInUp' : 'opacity-0'}" style="animation-delay: 0.3s;">
        <a
          href="https://www.instagram.com/shellboxencargos/"
          target="_blank"
          rel="noopener noreferrer"
          class="group px-8 py-3.5 bg-orange-500 text-white rounded-xl font-medium text-base hover:bg-orange-600 active:scale-[0.98] transition-all"
        >
          Hacer un Encargo
        </a>
        <a
          href="/stock"
          class="px-8 py-3.5 text-orange-500 font-medium text-base hover:bg-orange-50 rounded-xl transition-all"
        >
          Ver Stock en Cuba
        </a>
      </div>

      <!-- Trust Indicators - Más aire, menos peso visual -->
      <div class="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto {isVisible ? 'animate-fadeIn' : 'opacity-0'}" style="animation-delay: 0.45s;">
        <div class="flex flex-col items-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="font-medium text-base text-gray-900">Precio al momento</h3>
          <p class="text-sm text-gray-500 font-light">Sin esperar a que llegue</p>
        </div>

        <div class="flex flex-col items-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h3 class="font-medium text-base text-gray-900">Rápido y confiable</h3>
          <p class="text-sm text-gray-500 font-light">20-25 días a Cuba</p>
        </div>

        <div class="flex flex-col items-center space-y-3">
          <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h3 class="font-medium text-base text-gray-900">Asesoramiento</h3>
          <p class="text-sm text-gray-500 font-light">Respaldo constante</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll Indicator - Más discreto -->
  <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce opacity-30">
    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  </div>
</section>
