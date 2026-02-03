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

// Memory Data Configuration
const MEMORIES = [
    {
        type: 'text',
        title: 'The First Spark',
        content: 'Do you remember when we first started talking? I knew right away you were special.',
        icon: '✨'
    },
    {
        type: 'image',
        title: 'Our Adventure',
        url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7', // Placeholder
        icon: '✈️'
    },
    {
        type: 'text',
        title: 'My Promise',
        content: 'To always make you laugh, hold your hand, and be your biggest fan. Forever.',
        icon: '❤️'
    }
];

// ========== DOM ELEMENTS ==========
const els = {
    loadingScreen: document.getElementById('loadingScreen'),
    loadingLine: document.querySelector('.loading-screen .loader-line'),
    loadingMsg: document.querySelector('.loading-screen .loading-message'),
    mainScreen: document.getElementById('mainScreen'),
    giftScreen: document.getElementById('giftScreen'), // Added ref
    memoriesScreen: document.getElementById('memoriesScreen'), // Added ref
    celebrationScreen: document.getElementById('celebrationScreen'),
    yesBtn: document.getElementById('yesBtn'),
    noBtn: document.getElementById('noBtn'),
    bgMusic: document.getElementById('bgMusic'),
    typingContainer: document.getElementById('typingText'),
    cursor: document.getElementById('heartCursor'),
    polaroidContainer: document.getElementById('polaroidContainer'),
    giftBox: document.getElementById('giftBox'),
    memoryOverlay: document.getElementById('memoryOverlay'),
    instruction: document.getElementById('giftInstruction')
};

let isPlaying = false;
let noHoverCount = 0;
let unlockedMemoryIndex = 0;

// ========== INITIALIZATION ==========
window.addEventListener('load', () => {
    // Reveal Loading Screen Animation
    const tl = gsap.timeline();

    tl.to(els.loadingLine, { width: '200px', duration: 1.5, ease: "power2.inOut" })
        .to(els.loadingMsg, { opacity: 1, duration: 1 }, "-=1")
        .to(els.loadingScreen, {
            opacity: 0,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => els.loadingScreen.style.display = 'none'
        }, "+=0.5")
        .to(els.mainScreen, { opacity: 1, duration: 1 }) // Reveal Main Screen
        .from(".vogue-label", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".architectural-headline", { y: 30, opacity: 0, duration: 1, ease: "back.out(1.7)" }, "-=0.6")
        .add(() => typeWriter(TYPING_TEXT, 0), "-=0.2")
        .from(".luxury-signature", { opacity: 0, duration: 1 }, "+=1")
        .from(".control-center", { y: 20, opacity: 0, duration: 0.8 }, "-=0.5");

    // Initial instruction text update
    if (els.instruction) {
        els.instruction.textContent = `Tap to Unwrap Memory 1 of ${MEMORIES.length}`;
    }
});

// ========== MUSIC LOGIC (AUTO-PLAY) ==========
function ensureMusicPlays() {
    if (els.bgMusic.paused) {
        els.bgMusic.play().catch(e => {
            console.log("Auto-play prevented. Waiting for interaction.");
        });
    }
}
document.body.addEventListener('click', ensureMusicPlays, { once: true });
document.body.addEventListener('touchstart', ensureMusicPlays, { once: true });

// ========== TYPING EFFECT ==========
function typeWriter(text, i) {
    if (i < text.length) {
        els.typingContainer.innerHTML = text.substring(0, i + 1) + '<span class="cursor-blink">|</span>';
        setTimeout(() => typeWriter(text, i + 1), 30 + Math.random() * 30);
    } else {
        els.typingContainer.innerHTML = text;
        gsap.to(".luxury-signature", { opacity: 1, duration: 1 });
    }
}

// ========== CUSTOM CURSOR ==========
document.addEventListener('mousemove', (e) => {
    gsap.to(els.cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
});

// ========== NO BUTTON PSYCHOLOGY (ENHANCED) ==========
// We use mouseover for desktop and touchstart for mobile
// ========== NO BUTTON PSYCHOLOGY (ENHANCED) ==========
// We use mouseover for desktop and touchstart for mobile
// Fix: Use one robust set of listeners, removing duplicates
els.noBtn.addEventListener('mouseover', (e) => moveNoButton(e.clientX, e.clientY));
els.noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent click
    const touch = e.touches[0];
    moveNoButton(touch.clientX, touch.clientY);
}, { passive: false });

function moveNoButton(interactionX, interactionY) {
    noHoverCount++;
    const MIN_ESCAPE_DISTANCE = 150;

    // 0. Detach from Layout (Fix for Coordinate Traps)
    if (els.noBtn.parentNode !== document.body) {
        const rect = els.noBtn.getBoundingClientRect();
        els.noBtn.style.position = 'fixed';
        els.noBtn.style.left = rect.left + 'px';
        els.noBtn.style.top = rect.top + 'px';
        els.noBtn.style.width = rect.width + 'px';
        document.body.appendChild(els.noBtn);
    }

    // 1. Text Feedback (Looping)
    const textSpan = els.noBtn.querySelector('.btn-text');
    if (textSpan) {
        // Use modulus to loop forever
        const textIndex = noHoverCount % NO_BUTTON_TEXTS.length;
        textSpan.textContent = NO_BUTTON_TEXTS[textIndex];

        gsap.fromTo(textSpan,
            { y: -10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25 }
        );
    }
    els.noBtn.classList.add('begging');

    // 2. Physics & Boundaries
    const btnRect = els.noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width || 120;
    const btnHeight = btnRect.height || 50;
    const padding = 30;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const maxX = viewportW - btnWidth - padding;
    const maxY = viewportH - btnHeight - padding;

    // Current Button Center
    const btnX = btnRect.left + btnWidth / 2;
    const btnY = btnRect.top + btnHeight / 2;

    // Direction (Run away from cursor)
    let dirX = btnX - interactionX;
    let dirY = btnY - interactionY;

    // Force UPWARD Bias (Negative Y)
    dirY -= 50;

    // Normalize
    const len = Math.hypot(dirX, dirY) || 1;
    dirX /= len;
    dirY /= len;

    // Calculate Jump Distance
    const jumpDist = Math.max(MIN_ESCAPE_DISTANCE, 180 + Math.random() * 120);

    // Initial Target Calculation
    let targetX = btnRect.left + (dirX * jumpDist);
    let targetY = btnRect.top + (dirY * jumpDist);

    // 3. Logic Corrections & Loop Prevention
    // If it tries to go near the cursor again (e.g. bouncing off wall), force it away
    const predictedCenterX = targetX + btnWidth / 2;
    const predictedCenterY = targetY + btnHeight / 2;
    if (Math.hypot(predictedCenterX - interactionX, predictedCenterY - interactionY) < MIN_ESCAPE_DISTANCE) {
        // Teleport to random safe spot if logic fails
        targetX = Math.random() * (viewportW - btnWidth - padding) + padding;
        targetY = Math.random() * (viewportH * 0.5) + padding; // Top half
    }

    // 4. Strict Clamping (The Box)
    // If hitting bottom, force to top half
    if (targetY > maxY) {
        targetY = Math.random() * (maxY * 0.6);
    }

    // Clamp
    targetX = Math.max(padding, Math.min(maxX, targetX));
    targetY = Math.max(padding, Math.min(maxY, targetY));

    // 5. Execute
    gsap.to(els.noBtn, {
        left: targetX,
        top: targetY,
        rotation: (Math.random() * 30) - 15,
        scale: 0.9,
        duration: 0.35,
        ease: "power2.out",
        onComplete: () => {
            gsap.to(els.noBtn, { scale: 1, duration: 0.2 });
        }
    });

    ensureMusicPlays();
}

// ========== YES BUTTON -> GIFT SCREEN ==========
els.yesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ensureMusicPlays();
    fireConfetti();

    // Transition
    switchScreen(els.mainScreen, els.giftScreen);
});

// ========== GIFT BOX & MEMORIES LOGIC ==========
els.giftBox.addEventListener('click', () => {
    // If we have unlocked all memories, go to gallery
    if (unlockedMemoryIndex >= MEMORIES.length) {
        switchScreen(els.giftScreen, els.memoriesScreen, () => initGallery());
        return;
    }

    // Otherwise, Animate & Open Memory
    const tl = gsap.timeline();
    tl.to(els.giftBox, { scale: 0.9, duration: 0.1 })
        .to(els.giftBox, { scale: 1.1, rotation: 5, duration: 0.1, yoyo: true, repeat: 3 })
        .call(() => {
            fireConfetti();
            openMemoryOverlay(unlockedMemoryIndex);
        });
});

function openMemoryOverlay(index) {
    const mem = MEMORIES[index];
    const overlay = els.memoryOverlay;

    // Populate Data
    document.getElementById('memIcon').textContent = mem.icon;
    document.getElementById('memTitle').textContent = mem.title;

    const contentBox = document.getElementById('memContent');
    if (mem.type === 'image') {
        contentBox.innerHTML = `<img src="${mem.url}" class="memory-img" alt="Memory">`;
    } else {
        contentBox.innerHTML = `<p>${mem.content}</p>`;
    }

    // Show Overlay
    overlay.classList.add('active');
}

// "Keep This Memory" Button
const keepBtn = document.getElementById('keepMemoryBtn');
if (keepBtn) {
    keepBtn.addEventListener('click', () => {
        // Hide Overlay
        els.memoryOverlay.classList.remove('active');

        // Advance Progress
        unlockedMemoryIndex++;

        // Update Gift Box Style for Next Step
        if (els.giftBox) {
            els.giftBox.setAttribute('data-step', unlockedMemoryIndex);
        }

        // Update Instruction for Next Step
        if (unlockedMemoryIndex < MEMORIES.length) {
            els.instruction.textContent = `Tap to Unwrap Memory ${unlockedMemoryIndex + 1} of ${MEMORIES.length}`;
            gsap.fromTo(els.instruction, { scale: 1.3 }, { scale: 1, duration: 0.5 });
        } else {
            els.instruction.textContent = "All Memories Collected! Tap Box to View Your Journey";
            gsap.to(els.giftBox, { filter: "hue-rotate(90deg)", scale: 1.1, duration: 1, yoyo: true, repeat: -1 });
        }
    });
}

// ========== MEMORIES -> CELEBRATION ==========
const toFinalBtn = document.getElementById('toFinalBtn');
if (toFinalBtn) {
    toFinalBtn.addEventListener('click', () => {
        switchScreen(els.memoriesScreen, els.celebrationScreen, () => {
            triggerFinalCelebration();
        });
    });
}

// ========== GALLERY INITIALIZATION ==========
function initGallery() {
    const container = document.getElementById('galleryContainer');
    container.innerHTML = ''; // Clear previous

    MEMORIES.forEach(mem => {
        const div = document.createElement('div');
        div.className = 'memory-card';

        if (mem.type === 'image') {
            div.style.backgroundImage = `url('${mem.url}')`;
        } else {
            // Text memory card style
            div.style.background = '#fff';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            div.style.padding = '20px';
            div.innerHTML = `<p style="color: #000; font-size: 14px; text-align: center;">${mem.content}</p>`;
        }

        container.appendChild(div);
    });
}

// ========== HELPER: SCREEN TRANSITION ==========
function switchScreen(from, to, callback) {
    // 1. Prepare Next Screen
    to.style.display = 'flex';
    to.style.opacity = '0';
    to.style.visibility = 'visible';

    const tl = gsap.timeline({
        onComplete: () => {
            from.style.display = 'none';
            if (callback) callback();
        }
    });

    // 2. Animate Out
    tl.to(from, { opacity: 0, scale: 0.95, duration: 0.6, ease: "power2.inOut" })
        // 3. Animate In
        .to(to, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, "-=0.3");
}

// ========== CELEBRATION EFFECTS ==========
function triggerFinalCelebration() {
    els.bgMusic.volume = 1.0;

    // Flash
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.inset = '0';
    flash.style.background = '#fff';
    flash.style.zIndex = '9999';
    flash.style.pointerEvents = 'none';
    document.body.appendChild(flash);

    gsap.to(flash, { opacity: 0, duration: 1.5, onComplete: () => flash.remove() });

    // Reveal
    gsap.to(".reveal-content", { opacity: 1, scale: 1, duration: 1, delay: 0.5, ease: "back.out(1.2)" });

    startPolaroidRain();
}

function startPolaroidRain() {
    const emojis = ['🥰', '💑', '💍', '🥂', '🌹', '✨', '🍟', '🍦'];
    setInterval(() => {
        const p = document.createElement('div');
        p.className = 'polaroid';
        p.style.left = Math.random() * 90 + 'vw';
        p.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;

        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        p.innerHTML = `<div class="polaroid-inner">${emoji}</div>`;

        els.polaroidContainer.appendChild(p);

        gsap.to(p, {
            y: window.innerHeight + 200,
            duration: 4 + Math.random() * 3,
            ease: "none",
            onComplete: () => p.remove()
        });
    }, 600);
}

// Util: Confetti
function fireConfetti() {
    if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#ff2d75', '#ffffff'] });
    }
}


// ========== BONUS: GALLERY NAVIGATION ==========
const viewGalleryBtn = document.getElementById('viewGalleryBtn');
const galleryScreen = document.getElementById('galleryScreen');
const fixDateBtn = document.getElementById('fixDateBtn');

if (viewGalleryBtn && galleryScreen) {
    viewGalleryBtn.addEventListener('click', () => {
        // Switch from Celebration -> Gallery
        switchScreen(els.celebrationScreen, galleryScreen, () => {
            // Optional: Start scroll if needed via JS, but CSS handles it
        });
    });
}

if (fixDateBtn) {
    fixDateBtn.addEventListener('click', () => {
        // WhatsApp Redirect
        const phone = "918866666685";
        const message = encodeURIComponent("Hey! I loved the surprise. Kadi Malva Aavo! 💖");
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    });
}

