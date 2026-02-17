/**
 * ═══════════════════════════════════════════════════
 *   RADIANZA – Dark Luxury Resin · app.js
 *   Lógica de UI modular y limpia
 *   Módulos: Loader | Navigation | Taller | ScrollReveal
 * ═══════════════════════════════════════════════════
 */

'use strict';

/* ═══════════════════════════════════════════════════
   MÓDULO: CONFIGURACIÓN GLOBAL
═══════════════════════════════════════════════════ */
const CONFIG = {
  prices: {
    letra:   6500,
    tarjeta: 5000,
  },
  loader: {
    delay: 2800, // ms antes de ocultar el loader
  },
  textures: {
    none:    '',
    verano:  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    flores:  'https://images.unsplash.com/photo-1490750967868-88df5691cc8d?w=400&q=80',
    glitter: 'https://images.unsplash.com/photo-1612198273688-f55f42d22d8b?w=400&q=80',
  },
  lettraTextureFallback: 'https://images.unsplash.com/photo-1612198273688-f55f42d22d8b?w=400&q=80',
};

/* ═══════════════════════════════════════════════════
   ESTADO GLOBAL DEL CONFIGURADOR
═══════════════════════════════════════════════════ */
const state = {
  mode:        'letra',     // 'letra' | 'tarjeta'
  letra:       'A',         // Letra seleccionada
  color:       '#0a0a0a',   // Color base
  theme:       'none',      // 'none' | 'verano' | 'flores' | 'glitter'
  uploadedImg: null,        // URL de imagen subida (FileReader)
};

/* ═══════════════════════════════════════════════════
   MÓDULO: LOADER
═══════════════════════════════════════════════════ */
const LoaderModule = (() => {

  const loaderEl = document.getElementById('loader');

  /**
   * Oculta el loader con animación slide-up
   * y lo elimina del DOM para liberar recursos
   */
  function hide() {
    if (!loaderEl) return;

    loaderEl.classList.add('slide-up');

    // Quitar del flujo completamente tras la animación
    loaderEl.addEventListener('transitionend', () => {
      loaderEl.style.display = 'none';
      loaderEl.setAttribute('aria-hidden', 'true');
    }, { once: true });
  }

  function init() {
    // Esperar a que la barra de carga termine + delay visual
    setTimeout(hide, CONFIG.loader.delay);
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════
   MÓDULO: NAVEGACIÓN (Bottom Bar)
═══════════════════════════════════════════════════ */
const NavigationModule = (() => {

  const navItems = document.querySelectorAll('.nav-item');

  /**
   * Actualiza el ítem activo según la sección visible
   */
  function updateActiveItem() {
    const scrollY = window.scrollY;
    const sections = ['inicio', 'taller', 'contacto'];

    let current = 'inicio';

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.getBoundingClientRect().top <= 120) {
        current = id;
      }
    });

    navItems.forEach(item => {
      const section = item.dataset.section;
      item.classList.toggle('active', section === current);
      item.setAttribute('aria-current', section === current ? 'page' : 'false');
    });
  }

  function init() {
    window.addEventListener('scroll', updateActiveItem, { passive: true });
    updateActiveItem();
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════
   MÓDULO: SCROLL REVEAL
   Anima elementos al entrar en viewport
═══════════════════════════════════════════════════ */
const ScrollRevealModule = (() => {

  let observer;

  function init() {
    // Agregar clase reveal a secciones clave
    const targets = document.querySelectorAll(
      '.glass-card, .process-step, #filosofia h2, #filosofia p, #contacto h2'
    );

    targets.forEach(el => el.classList.add('reveal'));

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animar solo una vez
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    });

    targets.forEach(el => observer.observe(el));
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════
   MÓDULO: TALLER (Configurador Principal)
═══════════════════════════════════════════════════ */
const TallerModule = (() => {

  // ── Elementos DOM ──────────────────────────────
  const tabBtns              = document.querySelectorAll('.tab-btn');
  const panelLetra           = document.getElementById('panel-letra');
  const panelTarjeta         = document.getElementById('panel-tarjeta');
  const controlLetraInput    = document.getElementById('control-letra-input');
  const controlUpload        = document.getElementById('control-upload');

  const letraInputField      = document.getElementById('letra-input');
  const letraDisplay         = document.getElementById('letra-display');

  const tarjetaDisplay       = document.getElementById('tarjeta-display');
  const tarjetaResin         = document.getElementById('tarjeta-resin');
  const tarjetaTextureOverlay= document.getElementById('tarjeta-texture-overlay');
  const tarjetaImgContainer  = document.getElementById('tarjeta-img-container');
  const tarjetaUploadedImg   = document.getElementById('tarjeta-uploaded-img');
  const tarjetaPlaceholder   = document.getElementById('tarjeta-placeholder');

  const fileUploadInput      = document.getElementById('file-upload');
  const uploadLabelText      = document.getElementById('upload-label-text');

  const colorSwatches        = document.querySelectorAll('.color-swatch');
  const themeButtons         = document.querySelectorAll('.theme-btn');

  const priceDisplay         = document.getElementById('price-display');
  const priceModeLabel       = document.getElementById('price-mode-label');

  // ── Formateo de precio (ARS con separador de miles) ──
  function formatPrice(amount) {
    return '$' + amount.toLocaleString('es-AR');
  }

  // ── Actualizar precio ─────────────────────────
  function updatePrice() {
    const price = CONFIG.prices[state.mode];
    priceDisplay.textContent = formatPrice(price);
    priceModeLabel.textContent =
      state.mode === 'letra' ? 'Letra personalizada' : 'Porta Sube / Credencial';

    // Pequeña animación de "pop" en el precio
    priceDisplay.style.transform = 'scale(1.12)';
    priceDisplay.style.transition = 'transform 0.2s ease';
    setTimeout(() => {
      priceDisplay.style.transform = 'scale(1)';
    }, 200);
  }

  // ── Cambiar modo (Letra / Tarjeta) ────────────
  function setMode(mode) {
    state.mode = mode;

    // Actualizar tabs
    tabBtns.forEach(btn => {
      const isActive = btn.dataset.mode === mode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    // Mostrar/ocultar paneles
    if (mode === 'letra') {
      panelLetra.classList.remove('hidden');
      panelTarjeta.classList.add('hidden');
      controlLetraInput.classList.remove('hidden');
      controlUpload.classList.add('hidden');
    } else {
      panelLetra.classList.add('hidden');
      panelTarjeta.classList.remove('hidden');
      controlLetraInput.classList.add('hidden');
      controlUpload.classList.remove('hidden');
    }

    // Reanimar el panel visible
    const panel = mode === 'letra' ? panelLetra : panelTarjeta;
    panel.style.animation = 'none';
    panel.offsetHeight; // Reflow forzado
    panel.style.animation = '';

    // Aplicar color y tema al nuevo modo
    applyColor(state.color);
    applyTheme(state.theme);
    updatePrice();
  }

  // ── Aplicar color base ────────────────────────
  function applyColor(color) {
    state.color = color;

    if (state.mode === 'letra') {
      // El color de la letra viene de la textura; el bg detrás cambia levemente
      letraDisplay.style.textShadow =
        color === 'transparent'
          ? '0 0 60px rgba(212,175,55,0.6)'
          : `0 0 60px ${color}88`;
    } else {
      // En modo tarjeta, el color base es la capa de resina
      const colorMap = {
        '#0a0a0a': 'rgba(5, 5, 16, 0.75)',
        '#0f172a': 'rgba(15, 23, 42, 0.72)',
        '#3d1a2e': 'rgba(61, 26, 46, 0.72)',
        'transparent': 'rgba(5, 5, 16, 0.25)',
      };
      tarjetaResin.style.background = colorMap[color] || 'rgba(5, 5, 16, 0.75)';
    }
  }

  // ── Aplicar temática / textura ────────────────
  function applyTheme(theme) {
    state.theme = theme;

    const textureUrl = CONFIG.textures[theme] || '';

    if (state.mode === 'letra') {
      // Aplica la textura dentro de la letra con background-clip: text
      if (textureUrl) {
        letraDisplay.style.backgroundImage = `url('${textureUrl}')`;
        letraDisplay.style.backgroundSize = 'cover';
        letraDisplay.style.backgroundPosition = 'center';
      } else {
        // Sin inclusión: fallback glitter/dorado
        letraDisplay.style.backgroundImage = `url('${CONFIG.lettraTextureFallback}')`;
      }
    } else {
      // Aplica la textura como overlay sobre la tarjeta
      if (textureUrl) {
        tarjetaTextureOverlay.style.backgroundImage = `url('${textureUrl}')`;
        tarjetaTextureOverlay.style.opacity = '0.45';
      } else {
        tarjetaTextureOverlay.style.opacity = '0';
        tarjetaTextureOverlay.style.backgroundImage = '';
      }
    }
  }

  // ── Manejar input de letra ────────────────────
  function handleLetraInput(e) {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    letraInputField.value = val;
    state.letra = val || 'A';
    letraDisplay.textContent = state.letra;

    // Animación sutil al cambiar letra
    letraDisplay.style.transition = 'transform 0.2s ease, filter 0.3s ease';
    letraDisplay.style.transform = 'scale(0.9)';
    setTimeout(() => {
      letraDisplay.style.transform = 'scale(1)';
    }, 150);
  }

  // ── FileReader: Previsualizar imagen en tarjeta ──
  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();

    reader.onloadstart = () => {
      uploadLabelText.textContent = 'Cargando imagen…';
    };

    reader.onload = (event) => {
      state.uploadedImg = event.target.result;

      // Mostrar imagen en la tarjeta
      tarjetaUploadedImg.src = state.uploadedImg;
      tarjetaUploadedImg.classList.remove('hidden');
      tarjetaPlaceholder.style.display = 'none';

      // Actualizar label
      uploadLabelText.textContent = '✓ Imagen cargada · Cambiar';

      // Ajustar overlay para que la imagen se vea bien
      tarjetaResin.style.opacity = '0.8';
    };

    reader.onerror = () => {
      uploadLabelText.textContent = '✗ Error al cargar. Intentá de nuevo.';
    };

    reader.readAsDataURL(file);
  }

  // ── Manejar swatches de color ─────────────────
  function handleColorSwatch(e) {
    const swatch = e.currentTarget;
    const color = swatch.dataset.color;

    colorSwatches.forEach(s => {
      s.classList.remove('active');
      s.setAttribute('aria-pressed', 'false');
    });

    swatch.classList.add('active');
    swatch.setAttribute('aria-pressed', 'true');
    applyColor(color);
  }

  // ── Manejar botones de temática ──────────────
  function handleThemeBtn(e) {
    const btn = e.currentTarget;
    const theme = btn.dataset.theme;

    themeButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    applyTheme(theme);
  }

  // ── Keyboard: activar swatches con Enter/Space ─
  function handleSwatchKeyboard(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  }

  // ── Inicializar eventos ──────────────────────
  function bindEvents() {

    // Tabs
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => setMode(btn.dataset.mode));
    });

    // Input de letra
    letraInputField?.addEventListener('input', handleLetraInput);
    letraInputField?.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !letraInputField.value) {
        state.letra = 'A';
        letraDisplay.textContent = 'A';
      }
    });

    // File upload
    fileUploadInput?.addEventListener('change', handleFileUpload);

    // Color swatches
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', handleColorSwatch);
      swatch.addEventListener('keydown', handleSwatchKeyboard);
    });

    // Theme buttons
    themeButtons.forEach(btn => {
      btn.addEventListener('click', handleThemeBtn);
      btn.addEventListener('keydown', handleSwatchKeyboard);
    });
  }

  // ── Estado inicial ────────────────────────────
  function initState() {
    letraDisplay.textContent = state.letra;
    letraInputField.value = state.letra;
    applyColor(state.color);
    applyTheme(state.theme);
    updatePrice();
  }

  function init() {
    bindEvents();
    initState();
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════
   MÓDULO: SMOOTH SCROLL para anchors
═══════════════════════════════════════════════════ */
const SmoothScrollModule = (() => {

  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();

        const offset = 80; // Compensar bottom nav
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════
   MÓDULO: EFECTO PARALLAX suave en el hero
═══════════════════════════════════════════════════ */
const ParallaxModule = (() => {

  const blobs = document.querySelectorAll('.blob');
  let rafId = null;

  function onScroll() {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const factor = scrollY * 0.15;

      blobs.forEach((blob, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        blob.style.transform = `translateY(${factor * dir * 0.5}px)`;
      });
    });
  }

  function init() {
    // Solo activar si la pantalla es lo suficientemente grande
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  return { init };
})();

/* ═══════════════════════════════════════════════════
   BOOT: Inicialización principal
═══════════════════════════════════════════════════ */
function boot() {
  LoaderModule.init();
  NavigationModule.init();
  ScrollRevealModule.init();
  TallerModule.init();
  SmoothScrollModule.init();
  ParallaxModule.init();

  console.log(
    '%c✦ RADIANZA%c Dark Luxury Resin · Caleta Olivia, Patagonia',
    'color: #d4af37; font-size: 1.2rem; font-weight: bold; font-family: serif;',
    'color: #9a7d20; font-size: 0.8rem;',
  );
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
          }
          
