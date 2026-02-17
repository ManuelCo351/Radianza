// js/app.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS AL DOM (Elementos HTML) ---
    const dom = {
        views: {
            letter: document.getElementById('view-letter'),
            card: document.getElementById('view-card')
        },
        elements: {
            letterDisplay: document.getElementById('letter-display'),
            cardBase: document.getElementById('card-base'),
            cardPhoto: document.getElementById('card-photo'),
            cardTheme: document.getElementById('card-theme'),
            priceTag: document.getElementById('price-tag')
        },
        controls: {
            btnLetter: document.getElementById('btn-mode-letter'),
            btnCard: document.getElementById('btn-mode-card'),
            panelLetter: document.getElementById('controls-letter-input'),
            panelCard: document.getElementById('controls-card-upload'),
            inputLetter: document.getElementById('input-letter'),
            inputUpload: document.getElementById('input-upload'),
            colorBtns: document.querySelectorAll('.color-btn'),
            themeBtns: document.querySelectorAll('.theme-btn')
        }
    };

    // --- ESTADO INICIAL ---
    let state = {
        mode: 'letter', // 'letter' o 'card'
        basePrice: 6500
    };

    // --- FUNCIONES ---

    const updatePrice = () => {
        dom.elements.priceTag.innerText = "$" + state.basePrice.toLocaleString('es-AR');
    };

    const setMode = (newMode) => {
        state.mode = newMode;

        if (newMode === 'letter') {
            // Mostrar Vista Letra
            dom.views.letter.classList.remove('hidden');
            dom.views.card.classList.add('hidden');
            
            // Paneles
            dom.controls.panelLetter.classList.remove('hidden');
            dom.controls.panelCard.classList.add('hidden');

            // Estilos Botones (Activo/Inactivo)
            dom.controls.btnLetter.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all bg-radianza-gold text-black shadow-lg";
            dom.controls.btnCard.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all";

            state.basePrice = 6500;
        } else {
            // Mostrar Vista Tarjeta
            dom.views.letter.classList.add('hidden');
            dom.views.card.classList.remove('hidden');

            // Paneles
            dom.controls.panelCard.classList.remove('hidden');
            dom.controls.panelLetter.classList.add('hidden');

            // Estilos Botones
            dom.controls.btnCard.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all bg-radianza-gold text-black shadow-lg";
            dom.controls.btnLetter.className = "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all";

            state.basePrice = 5000;
        }
        updatePrice();
    };

    const updateLetter = (val) => {
        dom.elements.letterDisplay.innerText = val ? val.toUpperCase() : "A";
    };

    const setResinColor = (color) => {
        if (state.mode === 'letter') {
            const el = dom.elements.letterDisplay;
            if(color === 'transparent') {
                el.style.backgroundImage = "url('https://img.freepik.com/free-photo/abstract-blue-paint-texture_1048-11264.jpg')";
                el.style.webkitTextFillColor = "transparent";
            } else {
                el.style.backgroundImage = `linear-gradient(135deg, ${color} 0%, #ffffff 50%, ${color} 100%)`;
                el.style.webkitTextFillColor = "transparent"; 
            }
        } else {
            const el = dom.elements.cardBase;
            if(color === 'transparent') {
                el.style.backgroundColor = "rgba(255,255,255,0.1)";
            } else {
                el.style.backgroundColor = color;
            }
        }
    };

    const setTheme = (theme) => {
        let imgUrl = "";
        let blendMode = "overlay";

        // Mapeo de temas
        const themes = {
            'summer': { url: "url('https://img.freepik.com/free-photo/sand-texture-background-summer-vibe_53876-137785.jpg')", blend: "soft-light" },
            'flowers': { url: "url('https://img.freepik.com/free-photo/pressed-flowers-background_23-2149317822.jpg')", blend: "multiply" },
            'glitter': { url: "url('https://img.freepik.com/free-photo/gold-glitter-texture-background_53876-101166.jpg')", blend: "screen" }
        };

        if (state.mode === 'letter') {
            if (theme === 'none') {
                dom.elements.letterDisplay.style.filter = "none";
                // Forzar re-render suave del color base si es necesario
                // (En versiones simples solo quitamos la imagen extra si la hubiera)
            } else if (themes[theme]) {
                dom.elements.letterDisplay.style.backgroundImage = themes[theme].url;
            }
        } else {
            // Modo Tarjeta
            const el = dom.elements.cardTheme;
            if (theme === 'none') {
                el.style.opacity = 0;
            } else if (themes[theme]) {
                el.style.backgroundImage = themes[theme].url;
                el.style.mixBlendMode = themes[theme].blend;
                el.style.opacity = 0.6;
            }
        }
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                dom.elements.cardPhoto.style.backgroundImage = `url(${evt.target.result})`;
                dom.elements.cardPhoto.style.opacity = 1;
            }
            reader.readAsDataURL(file);
        }
    };

    // --- EVENT LISTENERS (Escuchadores de eventos) ---
    
    // Botones de Modo
    dom.controls.btnLetter.addEventListener('click', () => setMode('letter'));
    dom.controls.btnCard.addEventListener('click', () => setMode('card'));

    // Input Letra
    dom.controls.inputLetter.addEventListener('input', (e) => updateLetter(e.target.value));

    // Upload Foto
    dom.controls.inputUpload.addEventListener('change', handleUpload);

    // Botones de Color (Delegación simple o iteración)
    dom.controls.colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setResinColor(btn.dataset.color);
        });
    });

    // Botones de Tema
    dom.controls.themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // El click puede ser en la imagen o span, buscamos el botón padre
            const targetBtn = btn.closest('button'); 
            setTheme(targetBtn.dataset.theme);
        });
    });

    // Iniciar
    setMode('letter');
});
          
