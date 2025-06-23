// Simple cinematic experience
let currentSection = 'intro';
let isAnimating = false;
let grainActive = true;
let soundActive = true; // Audio activado por defecto
let videoReady = false; // Control de carga del video
let videoStarted = false; // Control de si el video ya comenzó
let pendingUnmute = false; // Si el usuario pidió sonido antes de que el video esté listo

// Initialize the application
function init() {
    console.log('Inicializando aplicación...');
    setupEventListeners();
    setupVideoBackground(); // Primero cargar el video
    // No mostrar contenido hasta que el video esté listo
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

    // Switch minimalista para el ruido
    const grainSwitch = document.getElementById('grain-switch');
    if (grainSwitch) {
        grainSwitch.onclick = () => {
            setGrain(!grainActive);
        };
    }

    // Switch minimalista para el sonido
    const soundSwitch = document.getElementById('sound-switch');
    if (soundSwitch) {
        soundSwitch.onclick = () => {
            toggleSound();
        };
    }

    // Eventos para habilitar audio con interacción del usuario
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });

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

// Navigation function
function navigateToSection(section) {
    if (isAnimating || section === currentSection) return;
    
    console.log('Cambiando a sección:', section);
    isAnimating = true;
    currentSection = section;

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

    // Change colors based on section
    changeInterfaceColors(section);

    setTimeout(() => {
        isAnimating = false;
    }, 300);
}

// Change interface colors based on Ikigai section
function changeInterfaceColors(section) {
    const colors = {
        intro: {
            primary: '#ffffff',
            accent: '#ffffff',
            background: 'rgba(0, 0, 0, 0.8)',
            border: 'rgba(255, 255, 255, 0.3)'
        },
        love: {
            primary: '#ff6b9d',
            accent: '#ff8fab',
            background: 'rgba(255, 107, 157, 0.1)',
            border: 'rgba(255, 107, 157, 0.5)'
        },
        skills: {
            primary: '#4ecdc4',
            accent: '#45b7d1',
            background: 'rgba(78, 205, 196, 0.1)',
            border: 'rgba(78, 205, 196, 0.5)'
        },
        money: {
            primary: '#ffe66d',
            accent: '#ffd93d',
            background: 'rgba(255, 230, 109, 0.1)',
            border: 'rgba(255, 230, 109, 0.5)'
        },
        world: {
            primary: '#a8e6cf',
            accent: '#88d8c0',
            background: 'rgba(168, 230, 207, 0.1)',
            border: 'rgba(168, 230, 207, 0.5)'
        },
        ikigai: {
            primary: '#ff6b6b',
            accent: '#4ecdc4',
            background: 'rgba(255, 107, 107, 0.1)',
            border: 'rgba(255, 107, 107, 0.5)'
        }
    };

    const colorScheme = colors[section];
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-color', colorScheme.primary);
    root.style.setProperty('--accent-color', colorScheme.accent);
    root.style.setProperty('--background-color', colorScheme.background);
    root.style.setProperty('--border-color', colorScheme.border);
    
    // Update specific elements
    const header = document.querySelector('.header');
    const title = document.querySelector('.title');
    const navBtns = document.querySelectorAll('.nav-btn');
    const contentPanel = document.querySelector('.content-panel');
    
    if (header) {
        header.style.background = colorScheme.background;
        header.style.borderBottomColor = colorScheme.border;
    }
    
    if (title) {
        title.style.color = colorScheme.primary;
    }
    
    navBtns.forEach(btn => {
        btn.style.borderColor = colorScheme.border;
        btn.style.color = colorScheme.primary;
    });
    
    if (contentPanel) {
        contentPanel.style.borderTopColor = colorScheme.border;
    }
    
    // Update active nav button
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        activeBtn.style.background = colorScheme.background;
        activeBtn.style.borderColor = colorScheme.primary;
        activeBtn.style.boxShadow = `0 0 20px ${colorScheme.primary}40`;
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

// Toggle music (placeholder)
function toggleMusic() {
    console.log('Alternando música...');
}

// Start journey function
function startJourney() {
    console.log('Iniciando viaje...');
    navigateToSection('love');
    const contentPanel = document.querySelector('.content-panel');
    if (contentPanel) {
        contentPanel.classList.add('active');
    }
}

// Toggle grain effect
function toggleGrain() {
    console.log('Alternando grano...');
    const grain = document.querySelector('.film-grain');
    if (grain) {
        if (grain.style.opacity === '0') {
            grain.style.opacity = '0.1';
        } else {
            grain.style.opacity = '0';
        }
    }
}

// Toggle sound effect
function toggleSound() {
    console.log('Alternando sonido...');
    soundActive = !soundActive;
    
    const video = document.getElementById('vintage-video');
    const soundSwitch = document.getElementById('sound-switch');
    
    if (video) {
        if (soundActive) {
            if (!videoReady) {
                pendingUnmute = true;
                // Si el video no está listo, solo guardamos la intención
            } else {
                video.muted = false;
                video.volume = 0.7;
                if (!videoStarted) {
                    startVideoPlayback();
                }
                pendingUnmute = false;
            }
        } else {
            video.muted = true;
            pendingUnmute = false;
        }
    }
    
    if (soundSwitch) {
        if (soundActive) {
            soundSwitch.classList.add('active');
            soundSwitch.classList.remove('muted');
        } else {
            soundSwitch.classList.remove('active');
            soundSwitch.classList.add('muted');
        }
    }
}

// Window resize handler
function onWindowResize() {
    console.log('Redimensionando ventana...');
}

// Hide loading screen
function hideLoadingScreen() {
    console.log('Ocultando pantalla de carga...');
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 1500);
}

// Show content
function showContent() {
    console.log('Mostrando contenido');
    const loadingScreen = document.getElementById('loading-screen');
    const contentPanel = document.querySelector('.content-panel');
    
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    if (contentPanel) {
        contentPanel.classList.add('active');
    }
    
    setGrain(true);
    setSound(true);
}

// Switch minimalista para el ruido
function setGrain(active) {
    grainActive = active;
    const grain = document.querySelector('.film-grain');
    const switchBtn = document.getElementById('grain-switch');
    if (grain) grain.style.opacity = active ? '0.1' : '0';
    if (switchBtn) {
        if (active) switchBtn.classList.add('active');
        else switchBtn.classList.remove('active');
    }
}

// Switch minimalista para el sonido
function setSound(active) {
    soundActive = active;
    const video = document.getElementById('vintage-video');
    const soundSwitch = document.getElementById('sound-switch');
    
    if (video) {
        if (active) {
            video.muted = false;
            video.volume = 0.7;
            
            // Si el video no ha comenzado, iniciarlo
            if (!videoStarted) {
                startVideoPlayback();
            }
        } else {
            video.muted = true;
        }
    }
    
    if (soundSwitch) {
        if (active) {
            soundSwitch.classList.add('active');
            soundSwitch.classList.remove('muted');
        } else {
            soundSwitch.classList.remove('active');
            soundSwitch.classList.add('muted');
        }
    }
}

// Video de fondo vintage alegre
function setupVideoBackground() {
    const video = document.getElementById('vintage-video');
    const videoLoadingText = document.querySelector('.video-loading-text');
    const fallbackMessage = document.getElementById('fallback-message');
    const continueBtn = document.getElementById('continue-btn');

    if (video) {
        // Detectar si es móvil
        const isMobile = window.innerWidth <= 768;
        // Seleccionar la versión del video según el dispositivo
        const videoPath = isMobile ? 
            'assets/videos/background-mobile.webm' : 
            'assets/videos/background-desktop.webm';
        
        // Mostrar mensaje de carga
        if (videoLoadingText) {
            videoLoadingText.style.display = 'block';
            videoLoadingText.textContent = 'Cargando video...';
        }

        // Ocultar mensaje de fallback inicialmente
        if (fallbackMessage) {
            fallbackMessage.style.display = 'none';
        }

        // Timer para mostrar fallback después de 5 segundos
        setTimeout(() => {
            if (!videoReady) {
                console.log('Video no cargó en 5 segundos');
                if (videoLoadingText) {
                    videoLoadingText.style.display = 'none';
                }
                if (fallbackMessage) {
                    fallbackMessage.style.display = 'block';
                }
                if (continueBtn) {
                    continueBtn.onclick = () => {
                        console.log('Usuario eligió continuar sin video');
                        setupFallback();
                    };
                }
            }
        }, 5000);

        // Verificar si el archivo existe
        fetch(videoPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    console.log('Archivo de video encontrado, configurando...');
                    setupVideo(video, videoPath);
                } else {
                    console.log('Archivo de video no encontrado');
                    if (videoLoadingText) {
                        videoLoadingText.style.display = 'none';
                    }
                    if (fallbackMessage) {
                        fallbackMessage.style.display = 'block';
                    }
                    setupFallback();
                }
            })
            .catch(error => {
                console.log('Error verificando archivo de video:', error);
                if (videoLoadingText) {
                    videoLoadingText.style.display = 'none';
                }
                if (fallbackMessage) {
                    fallbackMessage.style.display = 'block';
                }
                setupFallback();
            });
    }
}

function setupVideo(video, videoPath) {
    const videoLoadingText = document.querySelector('.video-loading-text');
    const fallbackMessage = document.getElementById('fallback-message');
    const continueBtn = document.getElementById('continue-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');

    // Mostrar elementos de carga
    if (videoLoadingText) {
        videoLoadingText.style.display = 'block';
        videoLoadingText.textContent = 'Preparando experiencia inmersiva...';
    }
    if (fallbackMessage) fallbackMessage.style.display = 'none';
    if (progressBar) progressBar.style.width = '0%';
    if (progressText) progressText.textContent = '0%';

    // Configurar video
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('preload', 'auto');
    video.volume = 0.7;
    video.muted = true;
    video.src = videoPath;

    // Monitorear progreso de carga
    let lastLoadedTime = 0;
    const updateProgress = () => {
        if (!video.buffered.length) return;
        
        const duration = video.duration;
        const buffered = video.buffered.end(video.buffered.length - 1);
        const progress = Math.min((buffered / duration) * 100, 100);
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${Math.round(progress)}%`;
        
        // Si el progreso aumentó, actualizar el tiempo de última carga
        if (buffered > lastLoadedTime) {
            lastLoadedTime = buffered;
            clearTimeout(loadTimeout);
            loadTimeout = setTimeout(checkProgress, 5000);
        }
    };

    // Monitorear eventos de carga
    video.addEventListener('progress', updateProgress);
    video.addEventListener('timeupdate', updateProgress);
    
    // Timer para verificar si el video se estancó
    let loadTimeout = setTimeout(checkProgress, 5000);

    function checkProgress() {
        if (!videoReady) {
            console.log('Video no progresa, activando fallback');
            if (videoLoadingText) videoLoadingText.style.display = 'none';
            if (fallbackMessage) fallbackMessage.style.display = 'block';
            if (continueBtn) {
                continueBtn.onclick = () => {
                    console.log('Usuario eligió continuar sin video');
                    setupFallback();
                };
            }
        }
    }

    // Event listeners del video
    video.addEventListener('loadedmetadata', () => {
        console.log('Video metadata cargada');
        video.currentTime = 10;
    });

    video.addEventListener('loadeddata', () => {
        console.log('Video datos cargados');
        videoReady = true;
        video.currentTime = 10;
        if (progressBar) progressBar.style.width = '100%';
        if (progressText) progressText.textContent = '100%';
        startVideoPlayback();
    });

    video.addEventListener('error', (e) => {
        console.log('Error cargando video:', e);
        if (videoLoadingText) videoLoadingText.style.display = 'none';
        if (fallbackMessage) fallbackMessage.style.display = 'block';
        setupFallback();
    });

    // Iniciar carga
    video.load();
}

function setupFallback() {
    console.log('Aplicando fallback');
    const backgroundVideo = document.querySelector('.background-video');
    const loadingScreen = document.getElementById('loading-screen');
    const video = document.getElementById('vintage-video');
    
    if (video) {
        video.style.opacity = '0';
        setTimeout(() => {
            video.style.display = 'none';
        }, 1000);
    }
    
    if (backgroundVideo) {
        // Agregar clase para activar animación
        backgroundVideo.classList.add('fallback');
        
        // Precargar imágenes para el efecto de partículas
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3}px;
                height: ${Math.random() * 3}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5});
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${5 + Math.random() * 10}s linear infinite;
                opacity: 0;
                transition: opacity 1s ease;
            `;
            backgroundVideo.appendChild(particle);
            particles.push(particle);
        }
        
        // Mostrar partículas gradualmente
        setTimeout(() => {
            particles.forEach((particle, index) => {
                setTimeout(() => {
                    particle.style.opacity = '1';
                }, index * 50);
            });
        }, 500);
    }
    
    videoReady = true;
    
    if (loadingScreen) {
        // Agregar animación de desvanecimiento
        const waves = loadingScreen.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            wave.style.animation = 'none';
            wave.style.transform = 'scale(0)';
            setTimeout(() => {
                wave.style.transition = 'transform 0.5s ease';
                wave.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    wave.style.transform = 'scale(0)';
                }, 200);
            }, index * 100);
        });
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    showContent();
}

// Agregar estilos para las partículas
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        from { transform: translateY(0) rotate(0deg); }
        to { transform: translateY(-100vh) rotate(360deg); }
    }
    
    .particle {
        pointer-events: none;
        z-index: 1;
    }
`;
document.head.appendChild(style);

// Animación simple de sprites usando emojis (puedes cambiar por imágenes si tienes sprites)
function startSpriteAnimation() {
    const spriteDiv = document.getElementById('sprite-animation');
    if (!spriteDiv) return;
    const frames = ['🌊', '🌱', '🌞', '🌙', '✨', '🌊', '🌱', '🌞', '🌙', '✨'];
    let frame = 0;
    if (window.spriteInterval) clearInterval(window.spriteInterval);
    window.spriteInterval = setInterval(() => {
        spriteDiv.textContent = frames[frame % frames.length];
        frame++;
    }, 200);
}

// Función para iniciar la reproducción del video
function startVideoPlayback() {
    const video = document.getElementById('vintage-video');
    if (!video || videoStarted) return;
    video.currentTime = 10;
    video.play().then(() => {
        videoStarted = true;
        showContent();
    }).catch(() => {
        showContent();
    });
}

// Función para habilitar audio con interacción del usuario
function enableAudio() {
    const video = document.getElementById('vintage-video');
    if (!video || !soundActive) return;
    if (!videoReady) {
        pendingUnmute = true;
        return;
    }
    if (!videoStarted) {
        startVideoPlayback();
    }
    video.muted = false;
    pendingUnmute = false;
    console.log('Audio habilitado por interacción del usuario');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando aplicación...');
    startSpriteAnimation();
    init();
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    const sections = ['intro', 'love', 'skills', 'money', 'world', 'ikigai'];
    const currentIndex = sections.indexOf(currentSection);
    
    switch(e.key) {
        case 'ArrowRight':
            e.preventDefault();
            if (currentIndex < sections.length - 1) {
                navigateToSection(sections[currentIndex + 1]);
            }
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (currentIndex > 0) {
                navigateToSection(sections[currentIndex - 1]);
            }
            break;
        case 'Escape':
            resetView();
            break;
        case ' ':
            e.preventDefault();
            toggleGrain();
            break;
    }
});

// Add touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const sections = ['intro', 'love', 'skills', 'money', 'world', 'ikigai'];
    const currentIndex = sections.indexOf(currentSection);
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next section
        if (currentIndex < sections.length - 1) {
            navigateToSection(sections[currentIndex + 1]);
        }
    } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous section
        if (currentIndex > 0) {
            navigateToSection(sections[currentIndex - 1]);
        }
    }
}

// Fallback: if DOMContentLoaded doesn't fire, try window.onload
window.addEventListener('load', () => {
    console.log('Window loaded, verificando si ya se inicializó...');
    if (!document.querySelector('.content-panel.active')) {
        console.log('Inicializando desde window.load...');
        init();
    }
}); 