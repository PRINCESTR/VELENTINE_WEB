// ========== CONFIGURATION ==========
const TYPING_TEXT = "Dimple, every moment with you is a masterclass in beauty. You are the architecture of my happiness.";
const NO_BUTTON_TEXTS = [
    "Are you sure? 🥺",
    "Think again... 💕",
    "Don't break my heart! 💔",
    "I'll cook for you! 🍝",
    "I'll give you massages! 💆‍♀️",
    "Pretty please? 🎀",
    "You're my everything! 🌏",
    "Just click YES! 💖"
];

// ========== DOM ELEMENTS ==========
const els = {
    loadingScreen: document.getElementById('loadingScreen'),
    loadingLine: document.querySelector('.loading-screen .loader-line'),
    loadingMsg: document.querySelector('.loading-screen .loading-message'),
    mainScreen: document.getElementById('mainScreen'),
    celebrationScreen: document.getElementById('celebrationScreen'),
    yesBtn: document.getElementById('yesBtn'),
    noBtn: document.getElementById('noBtn'),
    musicToggle: document.getElementById('musicToggle'),
    bgMusic: document.getElementById('bgMusic'),
    typingContainer: document.getElementById('typingText'),
    cursor: document.getElementById('heartCursor'),
    polaroidContainer: document.getElementById('polaroidContainer')
};

let isPlaying = false;
let noHoverCount = 0;

// ========== INITIALIZATION (GSAP) ==========
window.addEventListener('load', () => {
    // Reveal Loading Screen
    const tl = gsap.timeline();

    tl.to(els.loadingLine, { width: '200px', duration: 1.5, ease: "power2.inOut" })
        .to(els.loadingMsg, { opacity: 1, duration: 1 }, "-=1")
        .to(els.loadingScreen, {
            opacity: 0,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => els.loadingScreen.style.display = 'none'
        }, "+=0.5")
        .to(els.mainScreen, { opacity: 1, duration: 1 })
        .from(".vogue-label", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".architectural-headline", { y: 30, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.6")
        .add(() => typeWriter(TYPING_TEXT, 0), "-=0.2")
        .from(".luxury-signature", { opacity: 0, duration: 1 }, "+=1") // Wait for typing
        .from(".control-center", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5");
});

// ========== TYPING EFFECT ==========
function typeWriter(text, i) {
    if (i < text.length) {
        els.typingContainer.innerHTML = text.substring(0, i + 1) + '<span class="cursor-blink">|</span>';
        setTimeout(() => typeWriter(text, i + 1), 30 + Math.random() * 30);
    } else {
        els.typingContainer.innerHTML = text; // Remove cursor at end
        gsap.to(".luxury-signature", { opacity: 1, duration: 1 });
    }
}

// ========== CUSTOM CURSOR ==========
document.addEventListener('mousemove', (e) => {
    gsap.to(els.cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });

    // Create trail
    if (Math.random() < 0.3) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);

        gsap.set(trail, { x: e.clientX, y: e.clientY });
        gsap.to(trail, {
            y: e.clientY + 20,
            opacity: 0,
            duration: 1,
            onComplete: () => trail.remove()
        });
    }
});

// ========== MUSIC LOGIC ==========
els.musicToggle.addEventListener('click', toggleMusic);

function toggleMusic() {
    if (isPlaying) {
        els.bgMusic.pause();
        els.musicToggle.classList.remove('playing');
        els.musicToggle.querySelector('.music-text').textContent = 'SOUND OFF';
    } else {
        els.bgMusic.play().catch(e => console.log("Audio needed user interaction first"));
        els.musicToggle.classList.add('playing');
        els.musicToggle.querySelector('.music-text').textContent = 'PLAYING OUR SONG';
    }
    isPlaying = !isPlaying;
}

// Force music play on first interaction if not playing
document.body.addEventListener('click', () => {
    if (!isPlaying && els.bgMusic.paused) toggleMusic();
}, { once: true });

// ========== "NO" BUTTON PSYCHOLOGY ==========
// Use GSAP Physics for smooth "repulsion"
els.noBtn.addEventListener('mousemove', (e) => {
    moveNoButton(e.clientX, e.clientY);
});
els.noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent click on mobile
    const touch = e.touches[0];
    moveNoButton(touch.clientX, touch.clientY);
});

function moveNoButton(x, y) {
    noHoverCount++;

    // Change text progressively
    if (noHoverCount < NO_BUTTON_TEXTS.length) {
        els.noBtn.querySelector('span').textContent = NO_BUTTON_TEXTS[noHoverCount];
        els.noBtn.classList.add('begging');
    }

    // "Run away" logic
    const rect = els.noBtn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;

    // Vector from button center to mouse
    let dx = btnX - x;
    let dy = btnY - y;

    // Normalize and scale (push Hard)
    const dist = Math.sqrt(dx * dx + dy * dy);
    const force = Math.max(150 - dist, 0) * 4; // Magnetic repulsion force

    if (dist < 150) {
        const angle = Math.atan2(dy, dx);
        const moveX = Math.cos(angle) * force;
        const moveY = Math.sin(angle) * force;

        gsap.to(els.noBtn, {
            x: `+=${moveX}`,
            y: `+=${moveY}`,
            duration: 0.3,
            ease: "power2.out"
        });
    }
}

// Final trick: Turning No into Yes if clicked (hard to do, but possible)
els.noBtn.addEventListener('click', () => {
    // If they manage to click it, it just accepts as YES
    triggerCelebration();
});

// ========== CELEBRATION SEQUENCE ==========
els.yesBtn.addEventListener('click', triggerCelebration);

function triggerCelebration() {
    // 1. Audio swell
    if (!isPlaying) toggleMusic();
    els.bgMusic.volume = 1.0;

    // 2. Hide Main
    gsap.to(els.mainScreen, { scale: 1.1, opacity: 0, duration: 0.8, ease: "power2.in" });

    // 3. Show Celebration
    setTimeout(() => {
        els.mainScreen.style.display = 'none';
        els.celebrationScreen.style.visibility = 'visible';

        const tl = gsap.timeline();

        // Flash White
        const flash = document.createElement('div');
        flash.style.cssText = "position:fixed;inset:0;background:#fff;z-index:9999;pointer-events:none;";
        document.body.appendChild(flash);
        gsap.to(flash, { opacity: 0, duration: 1, onComplete: () => flash.remove() });

        // Reveal Text
        tl.to(".reveal-content", { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" });

        // Start Rain
        startPolaroidRain();

    }, 800);
}

// ========== POLAROID RAIN ==========
function startPolaroidRain() {
    const emojis = ['🥰', '💑', '💍', '🥂', '🌹', '✨', '🍟', '🍦']; // Placeholders for memories

    setInterval(() => {
        const p = document.createElement('div');
        p.className = 'polaroid';
        p.style.left = Math.random() * 90 + 'vw';
        p.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        p.innerHTML = `
            <div class="polaroid-inner">${emoji}</div>
        `;

        els.polaroidContainer.appendChild(p);

        // GSAP Drop animation
        gsap.to(p, {
            y: window.innerHeight + 300,
            rotation: Math.random() * 180 - 90,
            duration: 3 + Math.random() * 3,
            ease: "none",
            onComplete: () => p.remove()
        });

    }, 400); // New photo every 400ms
}

// Resize handler
window.addEventListener('resize', () => {
    // Reset any odd offsets if needed
});
