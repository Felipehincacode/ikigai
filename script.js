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
    if (!videoReady) {
        console.log('Video no está listo, esperando...');
        return;
    }
    
    console.log('Mostrando contenido...');
    
    // Ocultar pantalla de carga
    hideLoadingScreen();
    
    // Mostrar panel de contenido
    const contentPanel = document.querySelector('.content-panel');
    if (contentPanel) {
        setTimeout(() => {
            contentPanel.classList.add('active');
        }, 500);
    }
    
    // Activar efectos por defecto
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
    if (video) {
        // Video local en assets/videos
        const videoPath = 'assets/videos/Max Richter - November  (Music Video 2024).mp4';
        
        // Verificar si el archivo existe
        fetch(videoPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    console.log('Archivo de video encontrado, configurando...');
                    setupVideo(video, videoPath);
                } else {
                    console.log('Archivo de video no encontrado, usando fallback');
                    setupFallback();
                }
            })
            .catch(error => {
                console.log('Error verificando archivo de video:', error);
                setupFallback();
            });
    }
}

function setupVideo(video, videoPath) {
    const videoLoadingText = document.querySelector('.video-loading-text');
    const fallbackMessage = document.getElementById('fallback-message');
    const continueBtn = document.getElementById('continue-btn');
    if (videoLoadingText) {
        videoLoadingText.style.display = 'block';
        videoLoadingText.textContent = 'Cargando video...';
    }
    if (fallbackMessage) fallbackMessage.style.display = 'none';
    if (continueBtn) continueBtn.style.display = 'none';
    video.setAttribute('autoplay', '');
    video.setAttribute('loop', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('preload', 'auto');
    video.volume = 0.7;
    video.muted = false;
    video.src = videoPath;
    video.load();
    let videoLoadTimeout = setTimeout(() => {
        if (!videoReady) {
            if (videoLoadingText) videoLoadingText.textContent = '';
            if (fallbackMessage) fallbackMessage.style.display = 'block';
            if (continueBtn) continueBtn.style.display = 'inline-block';
            // No ocultar loading screen hasta que el usuario decida
            if (continueBtn) {
                continueBtn.onclick = () => {
                    setupFallback();
                    videoReady = true;
                    showContent();
                };
            }
        }
    }, 5000); // 5 segundos máximo
    video.addEventListener('loadedmetadata', function() {
        video.currentTime = 10;
        if (videoLoadingText) videoLoadingText.textContent = 'Video cargado, iniciando reproducción...';
    });
    video.addEventListener('loadeddata', function() {
        if (videoLoadingText) videoLoadingText.textContent = 'Video listo!';
        videoReady = true;
        video.currentTime = 10;
        clearTimeout(videoLoadTimeout);
        if (fallbackMessage) fallbackMessage.style.display = 'none';
        if (continueBtn) continueBtn.style.display = 'none';
        startVideoPlayback();
    });
    video.addEventListener('error', function(e) {
        if (videoLoadingText) videoLoadingText.textContent = '';
        if (fallbackMessage) fallbackMessage.style.display = 'block';
        if (continueBtn) continueBtn.style.display = 'inline-block';
        clearTimeout(videoLoadTimeout);
        if (continueBtn) {
            continueBtn.onclick = () => {
                setupFallback();
                videoReady = true;
                showContent();
            };
        }
    });
    video.addEventListener('play', function() {
        videoStarted = true;
    });
    video.addEventListener('pause', function() {});
    video.addEventListener('volumechange', function() {});
    // Animación de sprites en pantalla de carga
    startSpriteAnimation();
}

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

function setupFallback() {
    // Fallback: usar un gradiente si el video no carga
    const backgroundVideo = document.querySelector('.background-video');
    if (backgroundVideo) {
        backgroundVideo.style.background = 'linear-gradient(180deg, #000000 0%, #001122 30%, #003366 70%, #000000 100%)';
        console.log('Fallback aplicado: gradiente de fondo');
    }
    
    // Mostrar contenido incluso con fallback
    if (!videoReady) {
        videoReady = true;
        showContent();
    }
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