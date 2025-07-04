// Variables globales
let currentSection = 'intro';
let isAnimating = false;
let audioLoaded = false;

// Frases motivacionales para la pantalla de carga
const motivationalPhrases = [
    "Preparando tu experiencia inmersiva...",
    "Cada momento es una oportunidad para descubrir...",
    "El viaje hacia tu propósito comienza aquí...",
    "Conectando con la esencia de tu ser...",
    "Preparando el escenario para tu transformación...",
    "El universo conspira a tu favor...",
    "Tu ikigai te está esperando...",
    "Cargando la magia de la vida...",
    "Preparando el camino hacia tu verdad...",
    "La sabiduría ancestral se revela..."
];

// Función para forzar la reproducción del audio
function forceAudioPlay() {
    const audio = document.getElementById('background-sound');
    if (audio && audio.paused) {
        audio.play().then(() => {
            console.log('Audio forzado a reproducir exitosamente');
            audioLoaded = true;
            const audioControl = document.getElementById('audio-control');
            if (audioControl) {
                audioControl.textContent = '🔊 MÚSICA';
                audioControl.style.color = 'white';
            }
        }).catch(e => {
            console.log('Error forzando reproducción de audio:', e);
        });
    }
}

// Initialize the application
function init() {
    console.log('Inicializando aplicación...');
    startLoadingScreen();
    setupEventListeners();
    
    // Intentar reproducir audio con cualquier clic en la página
    document.addEventListener('click', () => {
        if (!audioLoaded) {
            forceAudioPlay();
        }
    }, { once: true });
}

// Setup event listeners
function setupEventListeners() {
    console.log('Configurando event listeners...');
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.dataset.section;
            console.log('Navegando a:', section);
            navigateToSection(section);
        });
    });

    // Fullscreen
    document.addEventListener('keydown', (e) => {
        const sections = ['intro', 'love', 'skills', 'money', 'world', 'ikigai'];
        const currentIndex = sections.indexOf(currentSection);
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                if (currentIndex < sections.length - 1) navigateToSection(sections[currentIndex + 1]);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (currentIndex > 0) navigateToSection(sections[currentIndex - 1]);
                break;
            case 'Escape':
                navigateToSection('intro');
                break;
        }
    });

    // Touch support
    let touchStartX = 0, touchEndX = 0;
    document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    function handleSwipe() {
        const sections = ['intro', 'love', 'skills', 'money', 'world', 'ikigai'];
        const currentIndex = sections.indexOf(currentSection);
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold && currentIndex < sections.length - 1) navigateToSection(sections[currentIndex + 1]);
        else if (touchEndX > touchStartX + swipeThreshold && currentIndex > 0) navigateToSection(sections[currentIndex - 1]);
    }

    // Window resize
    window.addEventListener('resize', onWindowResize);
}

// Pantalla de carga con frases motivacionales
function startLoadingScreen() {
    const motivationalText = document.getElementById('motivational-text');
    let phraseIndex = 0;

    // Mostrar la primera frase inmediatamente
    if (motivationalText) {
        motivationalText.textContent = motivationalPhrases[0];
        phraseIndex = 1;
    }

    // Cambiar frases motivacionales cada 2 segundos durante 10 segundos
    const phraseInterval = setInterval(() => {
        if (motivationalText) {
            motivationalText.style.opacity = '0';
            setTimeout(() => {
                motivationalText.textContent = motivationalPhrases[phraseIndex];
                motivationalText.style.opacity = '1';
                phraseIndex = (phraseIndex + 1) % motivationalPhrases.length;
            }, 300);
        }
    }, 2000);

    // Ocultar pantalla de carga después de 10 segundos
    setTimeout(() => {
        clearInterval(phraseInterval);
        hideLoadingScreen();
    }, 10000);

    // Cargar audio en paralelo
    setupAudioBackground();
}

// Ocultar pantalla de carga
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            showContent();
        }, 800);
    }
}

// Navigation function con cambio de GIF y efecto flash
function navigateToSection(section) {
    if (isAnimating || section === currentSection) return;
    
    console.log('Cambiando a sección:', section);
    isAnimating = true;
    currentSection = section;

    // Efecto de flash blanco
    const flashOverlay = document.getElementById('flash-overlay');
    if (flashOverlay) {
        flashOverlay.classList.add('flash');
        
        // Cambiar GIF después del flash
        setTimeout(() => {
            changeBackgroundGif(section);
            flashOverlay.classList.remove('flash');
        }, 150);
    }

    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === section) {
            btn.classList.add('active');
        }
    });

    // Update content sections
    document.querySelectorAll('.content-section').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Show content panel
    const contentPanel = document.querySelector('.content-panel');
    if (contentPanel) {
        contentPanel.classList.add('active');
    }

    setTimeout(() => {
        isAnimating = false;
    }, 300);
}

// Cambiar GIF de fondo
function changeBackgroundGif(section) {
    // Ocultar todos los GIFs
    document.querySelectorAll('.background-gif').forEach(gif => {
        gif.classList.remove('active');
    });
    
    // Mostrar el GIF correspondiente a la sección
    const targetGif = document.getElementById(`${section}-gif`);
    if (targetGif) {
        targetGif.classList.add('active');
    }
}

// Reset view
function resetView() {
    console.log('Reseteando vista...');
    navigateToSection('intro');
}

// Toggle fullscreen
function toggleFullscreen() {
    console.log('Alternando pantalla completa...');
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Toggle music
function toggleMusic() {
    console.log('Alternando música...');
}

// Start journey
function startJourney() {
    console.log('Iniciando navegación...');
    navigateToSection('love');
}

// Window resize handler
function onWindowResize() {
    console.log('Redimensionando ventana...');
}

// Show content
function showContent() {
    console.log('Mostrando contenido');
    const contentPanel = document.querySelector('.content-panel');
    
    if (contentPanel) {
        contentPanel.classList.add('active');
    }
}

// Configurar audio de fondo
function setupAudioBackground() {
    const audio = document.getElementById('background-sound');
    const audioControl = document.getElementById('audio-control');
    
    if (audio) {
        // Configurar el audio para mejor reproducción
        audio.preload = 'auto';
        audio.volume = 0.3;
        audio.loop = true;
        audio.muted = false;
        
        // Configurar el botón de control
        if (audioControl) {
            audioControl.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play().then(() => {
                        audioControl.textContent = '🔊 MÚSICA';
                        audioControl.style.color = 'white';
                    }).catch(e => {
                        console.log('Error reproduciendo audio:', e);
                        audioControl.textContent = '❌ ERROR';
                        audioControl.style.color = '#ff6b6b';
                    });
                } else {
                    audio.pause();
                    audioControl.textContent = '🔇 SILENCIO';
                    audioControl.style.color = '#ccc';
                }
            });
        }
        
        // Intentar reproducir inmediatamente
        const playAudio = () => {
            audio.currentTime = 20; // Comenzar desde el segundo 20
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Audio reproduciéndose correctamente');
                    audioLoaded = true;
                    if (audioControl) {
                        audioControl.textContent = '🔊 MÚSICA';
                        audioControl.style.color = 'white';
                    }
                }).catch(e => {
                    console.log('Error reproduciendo audio:', e);
                    audioLoaded = false;
                    if (audioControl) {
                        audioControl.textContent = '▶️ REPRODUCIR';
                        audioControl.style.color = '#4ecdc4';
                    }
                });
            }
        };

        // Intentar reproducir inmediatamente
        playAudio();

        // Intentar reproducir cuando el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', playAudio);
        }

        // Intentar reproducir después de cualquier interacción del usuario
        const userInteractionEvents = ['click', 'touchstart', 'keydown', 'scroll', 'mousemove'];
        userInteractionEvents.forEach(event => {
            document.addEventListener(event, () => {
                if (audio.paused && !audioLoaded) {
                    playAudio();
                }
            }, { once: true });
        });

        // Intentar reproducir cada 2 segundos durante los primeros 30 segundos
        let attempts = 0;
        const maxAttempts = 15; // 30 segundos / 2 segundos
        const attemptInterval = setInterval(() => {
            if (audio.paused && !audioLoaded && attempts < maxAttempts) {
                playAudio();
                attempts++;
            } else {
                clearInterval(attemptInterval);
            }
        }, 2000);

        // Eventos del audio
        audio.addEventListener('canplaythrough', () => {
            console.log('Audio cargado exitosamente');
            audioLoaded = true;
        });

        audio.addEventListener('error', (e) => {
            console.log('Error cargando audio:', e);
            audioLoaded = false;
            if (audioControl) {
                audioControl.textContent = '❌ ERROR';
                audioControl.style.color = '#ff6b6b';
            }
        });
        
        // Manejar pausas automáticas del navegador
        audio.addEventListener('pause', () => {
            console.log('Audio pausado, intentando reanudar...');
            setTimeout(() => {
                if (audio.paused && audioLoaded && audioControl && audioControl.textContent === '🔊 MÚSICA') {
                    audio.play().catch(e => console.log('Error reanudando audio:', e));
                }
            }, 100);
        });

        // Intentar reproducir cuando la página se vuelve visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && audio.paused && audioLoaded) {
                audio.play().catch(e => console.log('Error reproduciendo al volver visible:', e));
            }
        });

        // Intentar reproducir después de la pantalla de carga
        setTimeout(() => {
            if (audio.paused) {
                forceAudioPlay();
            }
        }, 11000); // Después de que termine la pantalla de carga

        // Intentar reproducir cuando la ventana se enfoca
        window.addEventListener('focus', () => {
            if (audio.paused && audioLoaded) {
                audio.play().catch(e => console.log('Error reproduciendo al enfocar ventana:', e));
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
