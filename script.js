document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const textDisplay = document.getElementById('text-display');
    const fontSelect = document.getElementById('font-select');
    const colorPicker = document.getElementById('color-picker');
    const bgColorPicker = document.getElementById('bg-color-picker');
    const applyBtn = document.getElementById('apply-btn');
    const resetStylesBtn = document.getElementById('reset-styles');
    const timeDisplay = document.getElementById('time');
    const dateDisplay = document.getElementById('date');
    const formatToggle = document.getElementById('format-toggle');
    const pauseClockBtn = document.getElementById('pause-clock');
    const galleryImage = document.getElementById('gallery-image');
    const imageCaption = document.getElementById('image-caption');
    const changeImageBtn = document.getElementById('change-image');
    const prevImageBtn = document.getElementById('prev-image');
    
    // Estado do aplicativo
    const state = {
        is24HourFormat: true,
        isClockRunning: true,
        clockInterval: null,
        currentImageIndex: 0,
        images: [
            {
                url: 'https://images.unsplash.com/photo-1551942801-8a6e9c0e9b0f?w=600&auto=format',
                alt: 'Pato nadando em um lago',
                caption: 'Pato em um lago tranquilo'
            },
            {
                url: 'https://images.unsplash.com/photo-1561336312-0a2c91b8b1d6?w=600&auto=format',
                alt: 'Pato branco em close',
                caption: 'Close de um pato branco'
            },
            {
                url: 'https://images.unsplash.com/photo-1504376379689-8d54347b26c6?w=600&auto=format',
                alt: 'Pato com filhotes',
                caption: 'Pato com seus filhotes'
            },
            {
                url: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=600&auto=format',
                alt: 'Pato voando',
                caption: 'Pato em voo'
            }
        ]
    };

    // Inicialização
    init();

    function init() {
        // Configurar eventos
        setupEventListeners();
        
        // Iniciar relógio
        startClock();
        
        // Atualizar galeria
        updateGalleryInfo();
    }

    function setupEventListeners() {
        // Aplicar estilo de texto
        applyBtn.addEventListener('click', applyTextStyles);
        
        // Resetar estilos
        resetStylesBtn.addEventListener('click', resetTextStyles);
        
        // Aplicar estilo ao pressionar Enter nos controles
        [fontSelect, colorPicker, bgColorPicker].forEach(control => {
            control.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') applyTextStyles();
            });
        });
        
        // Alternar formato de hora
        formatToggle.addEventListener('click', toggleTimeFormat);
        
        // Pausar/continuar relógio
        pauseClockBtn.addEventListener('click', toggleClock);
        
        // Navegação da galeria
        changeImageBtn.addEventListener('click', nextImage);
        prevImageBtn.addEventListener('click', prevImage);
        
        // Teclado para galeria
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });
    }

    // Funções para manipulação de texto
    function applyTextStyles() {
        textDisplay.style.fontFamily = fontSelect.value;
        textDisplay.style.color = colorPicker.value;
        textDisplay.style.backgroundColor = bgColorPicker.value;
        
        // Efeito visual
        animateElement(textDisplay, 'pulse');
        
        // Feedback para usuários de leitor de tela
        textDisplay.setAttribute('aria-label', `Texto com fonte ${fontSelect.options[fontSelect.selectedIndex].text} e cor ${colorPicker.value}`);
    }

    function resetTextStyles() {
        textDisplay.style.fontFamily = '';
        textDisplay.style.color = '';
        textDisplay.style.backgroundColor = '';
        fontSelect.value = "'Inter', sans-serif";
        colorPicker.value = '#333333';
        bgColorPicker.value = '#ffffff';
        
        animateElement(textDisplay, 'fadeIn');
        textDisplay.removeAttribute('aria-label');
    }

    // Funções do relógio
    function startClock() {
        updateClock();
        state.clockInterval = setInterval(updateClock, 1000);
        state.isClockRunning = true;
        pauseClockBtn.textContent = 'Pausar';
    }

    function stopClock() {
        clearInterval(state.clockInterval);
        state.isClockRunning = false;
        pauseClockBtn.textContent = 'Continuar';
    }

    function toggleClock() {
        if (state.isClockRunning) {
            stopClock();
        } else {
            startClock();
        }
        
        animateElement(pauseClockBtn, 'pulse');
    }

    function updateClock() {
        const now = new Date();
        
        // Formatar hora
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        if (!state.is24HourFormat) {
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours || 12; // Converter 0 para 12
            timeDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
        } else {
            timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
        
        // Formatar data
        dateDisplay.textContent = now.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    function toggleTimeFormat() {
        state.is24HourFormat = !state.is24HourFormat;
        updateClock();
        animateElement(formatToggle, 'pulse');
    }

    // Funções da galeria
    function nextImage() {
        state.currentImageIndex = (state.currentImageIndex + 1) % state.images.length;
        changeImage();
    }

    function prevImage() {
        state.currentImageIndex = (state.currentImageIndex - 1 + state.images.length) % state.images.length;
        changeImage();
    }

    function changeImage() {
        // Efeito de transição
        galleryImage.style.opacity = 0;
        
        setTimeout(() => {
            const image = state.images[state.currentImageIndex];
            galleryImage.src = image.url;
            galleryImage.alt = image.alt;
            galleryImage.style.opacity = 1;
            
            updateGalleryInfo();
            animateElement(galleryImage, 'fadeIn');
        }, 200);
    }

    function updateGalleryInfo() {
        const current = state.currentImageIndex + 1;
        const total = state.images.length;
        imageCaption.textContent = `${state.images[state.currentImageIndex].caption} (${current}/${total})`;
    }

    // Utilitários
    function animateElement(element, animation) {
        element.classList.add(animation);
        element.addEventListener('animationend', () => {
            element.classList.remove(animation);
        }, { once: true });
    }
});
