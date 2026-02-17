// ===================================
// RADIANZA - Interactive Logic
// Dark Luxury Configurator
// ===================================

// === STATE MANAGEMENT ===
const state = {
    modo: 'letra', // 'letra' o 'tarjeta'
    letra: 'A',
    color: 'black',
    inclusion: 'verano',
    imagen: null,
    precios: {
        letra: 6500,
        tarjeta: 5000
    }
};

// === DOM ELEMENTS ===
const elements = {
    // Loader
    loader: document.getElementById('loader'),
    
    // Modo Selector
    modoBtns: document.querySelectorAll('.modo-btn'),
    
    // Inputs
    inputLetra: document.getElementById('inputLetra'),
    inputTarjeta: document.getElementById('inputTarjeta'),
    letraInput: document.getElementById('letraInput'),
    tarjetaInput: document.getElementById('tarjetaInput'),
    imagePreviewName: document.getElementById('imagePreviewName'),
    
    // Preview
    previewLetra: document.getElementById('previewLetra'),
    previewTarjeta: document.getElementById('previewTarjeta'),
    letraDisplay: document.getElementById('letraDisplay'),
    tarjetaDisplay: document.getElementById('tarjetaDisplay'),
    tarjetaImage: document.getElementById('tarjetaImage'),
    
    // Controls
    colorBtns: document.querySelectorAll('.color-btn'),
    inclusionBtns: document.querySelectorAll('.inclusion-btn'),
    
    // Price
    precioDisplay: document.getElementById('precioDisplay'),
    
    // CTA
    btnPedido: document.getElementById('btnPedido')
};

// === INITIALIZATION ===
function init() {
    // Remove loader after animations
    setTimeout(() => {
        if (elements.loader) {
            elements.loader.style.display = 'none';
        }
    }, 3500);
    
    // Attach event listeners
    attachEventListeners();
    
    // Initialize preview
    updatePreview();
}

// === EVENT LISTENERS ===
function attachEventListeners() {
    // Modo buttons
    elements.modoBtns.forEach(btn => {
        btn.addEventListener('click', handleModoChange);
    });
    
    // Letra input
    if (elements.letraInput) {
        elements.letraInput.addEventListener('input', handleLetraInput);
    }
    
    // Tarjeta file input
    if (elements.tarjetaInput) {
        elements.tarjetaInput.addEventListener('change', handleImageUpload);
    }
    
    // Color buttons
    elements.colorBtns.forEach(btn => {
        btn.addEventListener('click', handleColorChange);
    });
    
    // Inclusion buttons
    elements.inclusionBtns.forEach(btn => {
        btn.addEventListener('click', handleInclusionChange);
    });
    
    // Pedido button
    if (elements.btnPedido) {
        elements.btnPedido.addEventListener('click', handlePedido);
    }
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// === MODO HANDLER ===
function handleModoChange(e) {
    const btn = e.currentTarget;
    const modo = btn.dataset.modo;
    
    // Update state
    state.modo = modo;
    
    // Update UI
    elements.modoBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Toggle input panels
    if (modo === 'letra') {
        elements.inputLetra.classList.remove('hidden');
        elements.inputTarjeta.classList.add('hidden');
        elements.previewLetra.classList.add('active');
        elements.previewTarjeta.classList.remove('active');
    } else {
        elements.inputLetra.classList.add('hidden');
        elements.inputTarjeta.classList.remove('hidden');
        elements.previewLetra.classList.remove('active');
        elements.previewTarjeta.classList.add('active');
    }
    
    // Update price
    updatePrice();
    
    // Update preview
    updatePreview();
}

// === LETRA INPUT HANDLER ===
function handleLetraInput(e) {
    let value = e.target.value.toUpperCase();
    
    // Only allow A-Z
    value = value.replace(/[^A-Z]/g, '');
    
    if (value.length > 0) {
        state.letra = value[0];
        e.target.value = value[0];
    } else {
        state.letra = 'A';
        e.target.value = 'A';
    }
    
    updatePreview();
}

// === IMAGE UPLOAD HANDLER ===
function handleImageUpload(e) {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 5MB.');
        return;
    }
    
    // Read file
    const reader = new FileReader();
    
    reader.onload = function(event) {
        state.imagen = event.target.result;
        
        // Show file name
        elements.imagePreviewName.textContent = `✓ ${file.name}`;
        elements.imagePreviewName.classList.remove('hidden');
        
        // Update preview
        updatePreview();
    };
    
    reader.onerror = function() {
        alert('Error al cargar la imagen. Intenta de nuevo.');
    };
    
    reader.readAsDataURL(file);
}

// === COLOR HANDLER ===
function handleColorChange(e) {
    const btn = e.currentTarget;
    const color = btn.dataset.color;
    
    // Update state
    state.color = color;
    
    // Update UI
    elements.colorBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update preview
    updatePreview();
}

// === INCLUSION HANDLER ===
function handleInclusionChange(e) {
    const btn = e.currentTarget;
    const inclusion = btn.dataset.inclusion;
    
    // Update state
    state.inclusion = inclusion;
    
    // Update UI
    elements.inclusionBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update preview
    updatePreview();
}

// === UPDATE PREVIEW ===
function updatePreview() {
    if (state.modo === 'letra') {
        updateLetraPreview();
    } else {
        updateTarjetaPreview();
    }
}

function updateLetraPreview() {
    // Update letter
    elements.letraDisplay.textContent = state.letra;
    
    // Update color/inclusion effect
    const inclusionGradients = {
        verano: 'linear-gradient(135deg, #f4d56b 0%, #d4af37 50%, #c4a747 100%)',
        flores: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
        glitter: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #d4af37 50%, #ffed4e 75%, #ffd700 100%)'
    };
    
    elements.letraDisplay.style.background = inclusionGradients[state.inclusion];
    elements.letraDisplay.style.backgroundClip = 'text';
    elements.letraDisplay.style.webkitBackgroundClip = 'text';
    elements.letraDisplay.style.webkitTextFillColor = 'transparent';
    
    // Add animation
    elements.letraDisplay.style.animation = 'none';
    setTimeout(() => {
        elements.letraDisplay.style.animation = 'fadeInScale 0.5s ease-out both';
    }, 10);
}

function updateTarjetaPreview() {
    // Color base backgrounds
    const colorBackgrounds = {
        black: 'linear-gradient(135deg, #0a0a0a, #1a1a1a)',
        blue: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
        pink: 'linear-gradient(135deg, #9d174d, #ec4899)',
        transparent: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2))'
    };
    
    elements.tarjetaDisplay.style.background = colorBackgrounds[state.color];
    
    // Update image if uploaded
    if (state.imagen) {
        elements.tarjetaImage.style.backgroundImage = `url(${state.imagen})`;
        elements.tarjetaImage.style.opacity = '0.7';
        elements.tarjetaImage.style.mixBlendMode = 'overlay';
    } else {
        elements.tarjetaImage.style.backgroundImage = 'none';
    }
    
    // Add inclusion overlay effect
    const inclusionOverlays = {
        verano: 'linear-gradient(135deg, rgba(244, 213, 107, 0.3), transparent)',
        flores: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), transparent)',
        glitter: 'linear-gradient(135deg, rgba(255, 215, 0, 0.4), transparent)'
    };
    
    const overlay = elements.tarjetaDisplay.querySelector('.tarjeta-overlay');
    if (overlay) {
        overlay.style.background = inclusionOverlays[state.inclusion];
    }
    
    // Add animation
    elements.tarjetaDisplay.style.animation = 'none';
    setTimeout(() => {
        elements.tarjetaDisplay.style.animation = 'fadeInScale 0.5s ease-out both';
    }, 10);
}

// === UPDATE PRICE ===
function updatePrice() {
    const precio = state.precios[state.modo];
    
    // Format price with thousands separator
    const precioFormateado = precio.toLocaleString('es-AR');
    
    // Update display with animation
    elements.precioDisplay.style.animation = 'none';
    setTimeout(() => {
        elements.precioDisplay.textContent = `$${precioFormateado}`;
        elements.precioDisplay.style.animation = 'fadeInScale 0.3s ease-out both';
    }, 10);
}

// === PEDIDO HANDLER ===
function handlePedido() {
    // Build WhatsApp message
    const tipo = state.modo === 'letra' ? 'Letra Molde Inverso' : 'Porta SUBE/Tarjeta';
    const detalle = state.modo === 'letra' ? `Letra: ${state.letra}` : 'Con imagen personalizada';
    const precio = state.precios[state.modo];
    
    const colorNames = {
        black: 'Negro',
        blue: 'Azul',
        pink: 'Rosa',
        transparent: 'Cristal Transparente'
    };
    
    const inclusionNames = {
        verano: 'Verano (Arena dorada)',
        flores: 'Flores secas',
        glitter: 'Glitter dorado'
    };
    
    const mensaje = `
¡Hola RADIANZA! 🌟

Quiero realizar un pedido:

📦 *Tipo:* ${tipo}
${detalle}
🎨 *Color base:* ${colorNames[state.color]}
✨ *Inclusiones:* ${inclusionNames[state.inclusion]}

💰 *Precio:* $${precio.toLocaleString('es-AR')}

¿Podemos coordinar los detalles?
    `.trim();
    
    // Encode for URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // WhatsApp URL (replace with real phone number)
    const whatsappURL = `https://wa.me/5491234567890?text=${mensajeCodificado}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
}

// === INTERSECTION OBSERVER (Optional smooth reveal) ===
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections (optional enhancement)
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
}

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', (e) => {
    // Press 'L' to switch to Letra mode
    if (e.key.toLowerCase() === 'l' && !e.target.matches('input')) {
        const letraBtn = document.querySelector('[data-modo="letra"]');
        if (letraBtn) letraBtn.click();
    }
    
    // Press 'T' to switch to Tarjeta mode
    if (e.key.toLowerCase() === 't' && !e.target.matches('input')) {
        const tarjetaBtn = document.querySelector('[data-modo="tarjeta"]');
        if (tarjetaBtn) tarjetaBtn.click();
    }
});

// === RUN ON PAGE LOAD ===
document.addEventListener('DOMContentLoaded', () => {
    init();
    // setupScrollAnimations(); // Uncomment for extra smooth reveals
    
    console.log('🌟 RADIANZA Dark Luxury - Sistema cargado correctamente');
    console.log('💡 Tip: Usa las teclas "L" y "T" para cambiar rápidamente entre modos');
});

// === UTILS ===
// Add CSS animation helper
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
