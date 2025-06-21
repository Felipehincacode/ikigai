// Simple cinematic experience
let currentSection = 'intro';
let isAnimating = false;
let grainActive = true;
let soundActive = true; // Audio activado por defecto

// Initialize the application
function init() {
    console.log('Inicializando aplicación...');
    setupEventListeners();
    hideLoadingScreen();
    showContent();
    setupVideoBackground();
    setGrain(true); // Activar grano por defecto
    setSound(true); // Activar sonido por defecto
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
            // Intentar habilitar el audio
            video.muted = false;
            
            // En móviles, intentar reproducir para habilitar audio
            if (video.paused) {
                video.play().catch(error => {
                    console.log('No se pudo reproducir automáticamente:', error);
                    // El usuario necesitará interactuar para habilitar audio
                });
            }
        } else {
            video.muted = true;
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
    console.log('Mostrando contenido...');
    const contentPanel = document.querySelector('.content-panel');
    if (contentPanel) {
        setTimeout(() => {
            contentPanel.classList.add('active');
        }, 1800);
    }
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
        video.muted = !active;
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
        video.src = 'assets/videos/Max Richter - November  (Music Video 2024).mp4';
        video.load();
        
        // Configurar para móviles
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.muted = false; // Audio habilitado por defecto
        
        // Habilitar audio con interacción del usuario
        const enableAudio = () => {
            if (video.muted && soundActive) {
                video.muted = false;
                console.log('Audio habilitado por interacción del usuario');
            }
        };
        
        // Eventos para habilitar audio
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('touchstart', enableAudio, { once: true });
        
        // Manejar errores de carga del video
        video.addEventListener('error', function() {
            console.log('Error cargando el video, usando fallback');
            // Fallback: usar un gradiente si el video no carga
            const backgroundVideo = document.querySelector('.background-video');
            if (backgroundVideo) {
                backgroundVideo.style.background = 'linear-gradient(180deg, #000000 0%, #001122 30%, #003366 70%, #000000 100%)';
            }
        });
        
        // Log cuando el video se carga correctamente
        video.addEventListener('loadeddata', function() {
            console.log('Video cargado correctamente');
        });
        
        // Manejar cambios en el estado de reproducción
        video.addEventListener('play', function() {
            console.log('Video reproduciéndose');
        });
        
        video.addEventListener('pause', function() {
            console.log('Video pausado');
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando aplicación...');
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