// Tab switching with URL routing
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function switchToTab(tabId) {
    // Update button states
    tabBtns.forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Switch tabs
    tabContents.forEach(content => content.classList.remove('active'));
    const activeContent = document.getElementById(tabId);
    if (activeContent) activeContent.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        // Update URL hash
        window.location.hash = tabId;

        switchToTab(tabId);
    });
});

// Handle initial load and hash changes
function handleRoute() {
    const hash = window.location.hash.slice(1); // Remove the # symbol
    const validTabs = ['home', 'resume'];
    const tabId = validTabs.includes(hash) ? hash : 'home';

    switchToTab(tabId);
}

// Listen for hash changes (browser back/forward buttons)
window.addEventListener('hashchange', handleRoute);

// Handle initial page load
handleRoute();

// Scroll reveal animations
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// MacBook/iPhone scroll animation
function initLaptopAnimation() {
    const projectContainers = document.querySelectorAll('.project-container');

    if (projectContainers.length === 0) return;

    function updateLaptops() {
        const isMobile = window.innerWidth < 768;

        projectContainers.forEach((container) => {
            const projectInfo = container.querySelector('.project-info');
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Progress based on scroll - start when top has 20vh gap from viewport top
            const triggerPoint = windowHeight * 0.80; // 20% from top
            const scrollRange = rect.height - windowHeight;
            let progress = 0;

            if (rect.top > triggerPoint) {
                // Screen top hasn't reached 15% from viewport top yet
                progress = 0;
            } else if (rect.top < -scrollRange) {
                progress = 1;
            } else {
                // Start progress when rect.top <= triggerPoint
                progress = (triggerPoint - rect.top) / (triggerPoint + scrollRange);
            }

            progress = Math.max(0, Math.min(1, progress));

            // Smooth easing
            const easeOut = t => 1 - Math.pow(1 - t, 3);

            if (isMobile) {
                // iPhone animation for mobile
                const iphone = container.querySelector('.iphone');
                const iphoneShadow = container.querySelector('.iphone-shadow');

                if (!iphone) return;

                // Animation phases for iPhone (faster on mobile):
                // Phase 1 (0-15%): Full screen zoomed in
                // Phase 2 (15-45%): Zoom out to phone size
                // Phase 3 (45-100%): Wobble + show info

                if (progress <= 0.15) {
                    // Phase 1: Zoomed in - showing big screen
                    const scale = 2.2;
                    iphone.style.transform = `scale(${scale}) rotateY(0deg) rotateX(0deg)`;
                    if (iphoneShadow) iphoneShadow.style.opacity = '0';
                    if (projectInfo) projectInfo.classList.remove('visible');

                } else if (progress <= 0.45) {
                    // Phase 2: Zoom out smoothly
                    const zoomProgress = (progress - 0.15) / 0.3;
                    const eased = easeOut(zoomProgress);

                    // Scale from 2.2 to 1
                    const scale = 2.2 - (eased * 1.2);
                    iphone.style.transform = `scale(${scale}) rotateY(0deg) rotateX(${eased * 5}deg)`;

                    if (iphoneShadow) iphoneShadow.style.opacity = (eased * 0.5).toString();
                    if (projectInfo) projectInfo.classList.remove('visible');

                } else {
                    // Phase 3: Wobble + show info
                    const tiltProgress = Math.min(1, (progress - 0.45) / 0.25);

                    // Wobble for iPhone (reduced duration)
                    const wobbleY = Math.sin(tiltProgress * Math.PI * 4) * 25 * (1 - tiltProgress * 0.8);
                    const wobbleX = Math.cos(tiltProgress * Math.PI * 3) * 10 * (1 - tiltProgress * 0.8);
                    const wobbleZ = Math.sin(tiltProgress * Math.PI * 2) * 5 * (1 - tiltProgress);

                    iphone.style.transform = `scale(1) rotateY(${wobbleY}deg) rotateX(${8 + wobbleX}deg) rotateZ(${wobbleZ}deg)`;

                    if (iphoneShadow) iphoneShadow.style.opacity = '0.5';
                    if (projectInfo) projectInfo.classList.add('visible');
                }
            } else {
                // MacBook animation for desktop
                const macbook = container.querySelector('.macbook');
                const macbookBase = container.querySelector('.macbook-base');
                const shadow = container.querySelector('.macbook-shadow');

                if (!macbook) return;

                // Animation phases:
                // Phase 1 (0-20%): Full screen zoomed in (shorter now since we start later)
                // Phase 2 (20-70%): Zoom out to laptop size + show base
                // Phase 3 (70-100%): Wobble + show info

                if (progress <= 0.2) {
                    // Phase 1: Zoomed in - showing big screen
                    const scale = 2.5;
                    macbook.style.transform = `scale(${scale}) rotateY(0deg) rotateX(0deg)`;
                    macbookBase.style.opacity = '0';
                    macbookBase.style.transform = 'scaleY(0)';
                    if (shadow) shadow.style.opacity = '0';
                    if (projectInfo) projectInfo.classList.remove('visible');

                } else if (progress <= 0.7) {
                    // Phase 2: Zoom out smoothly
                    const zoomProgress = (progress - 0.2) / 0.5; // 0.2 to 0.7 = 0.5 range
                    const eased = easeOut(zoomProgress);

                    // Scale from 2.5 to 1
                    const scale = 2.5 - (eased * 1.5);
                    macbook.style.transform = `scale(${scale}) rotateY(0deg) rotateX(${eased * 5}deg)`;

                    // Show base after halfway through zoom
                    const baseProgress = Math.max(0, (zoomProgress - 0.5) * 2);
                    macbookBase.style.opacity = baseProgress.toString();
                    macbookBase.style.transform = `scaleY(${baseProgress})`;

                    if (shadow) shadow.style.opacity = (eased * 0.5).toString();
                    if (projectInfo) projectInfo.classList.remove('visible');

                } else {
                    // Phase 3: Big noticeable wobble + show info
                    const tiltProgress = (progress - 0.7) / 0.3; // 0.7 to 1.0 = 0.3 range

                    // Strong wobble: ±45° rotation, multiple swings
                    const wobbleY = Math.sin(tiltProgress * Math.PI * 6) * 45 * (1 - tiltProgress * 0.7);
                    const wobbleX = Math.cos(tiltProgress * Math.PI * 4) * 20 * (1 - tiltProgress * 0.7);
                    const wobbleZ = Math.sin(tiltProgress * Math.PI * 3) * 10 * (1 - tiltProgress);

                    macbook.style.transform = `scale(1) rotateY(${wobbleY}deg) rotateX(${10 + wobbleX}deg) rotateZ(${wobbleZ}deg)`;

                    macbookBase.style.opacity = '1';
                    macbookBase.style.transform = 'scaleY(1)';
                    if (shadow) shadow.style.opacity = '0.5';
                    if (projectInfo) projectInfo.classList.add('visible');
                }
            }
        });
    }

    // Scroll handler with requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateLaptops();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', updateLaptops, { passive: true });

    // Initial run
    updateLaptops();
    setTimeout(updateLaptops, 100);
}

// Initialize laptop animation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLaptopAnimation);
} else {
    initLaptopAnimation();
}

// ==================== IMMERSIVE ENHANCEMENTS ====================

// 1. Typing Animation for Hero Tagline
function initTypingAnimation() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.innerHTML = '';
    tagline.style.visibility = 'visible';

    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    tagline.appendChild(cursor);

    function type() {
        if (i < text.length) {
            tagline.insertBefore(document.createTextNode(text.charAt(i)), cursor);
            i++;
            setTimeout(type, 40);
        } else {
            // Remove cursor after typing completes
            setTimeout(() => cursor.remove(), 2000);
        }
    }

    // Start after hero animations complete
    setTimeout(type, 1500);
}

// 2. Hero Mouse Parallax Effect
function initHeroParallax() {
    const hero = document.querySelector('.hero');
    const floatItems = document.querySelectorAll('.float-item');

    if (!hero || floatItems.length === 0) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Update CSS custom properties for gradient
        hero.style.setProperty('--mouse-x', `${x * 100}%`);
        hero.style.setProperty('--mouse-y', `${y * 100}%`);

        // Parallax for floating elements
        floatItems.forEach((item, index) => {
            const speed = (index % 3 + 1) * 8;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            item.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });

    hero.addEventListener('mouseleave', () => {
        hero.style.setProperty('--mouse-x', '50%');
        hero.style.setProperty('--mouse-y', '50%');
        floatItems.forEach(item => {
            item.style.transform = 'translate(0, 0)';
        });
    });
}

// 3. Timeline Dots Sequential Animation
function initTimelineAnimation() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const dots = timeline.querySelectorAll('.timeline-dot');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                dots.forEach((dot, index) => {
                    setTimeout(() => {
                        dot.classList.add('animate');
                    }, index * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(timeline);
}

// 4. Device 3D Tilt on Hover (for project info visible state)
function initDeviceTilt() {
    const projectContainers = document.querySelectorAll('.project-container');

    projectContainers.forEach(container => {
        const macbook = container.querySelector('.macbook');
        const iphone = container.querySelector('.iphone');
        const laptopContainer = container.querySelector('.laptop-container');
        const iphoneContainer = container.querySelector('.iphone-container');

        // MacBook tilt
        if (laptopContainer && macbook) {
            let isHovering = false;

            laptopContainer.addEventListener('mouseenter', () => {
                isHovering = true;
            });

            laptopContainer.addEventListener('mousemove', (e) => {
                if (!isHovering) return;

                const projectInfo = container.querySelector('.project-info');
                if (!projectInfo || !projectInfo.classList.contains('visible')) return;

                const rect = laptopContainer.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                macbook.style.transform = `scale(1) rotateY(${x * 20}deg) rotateX(${-y * 15}deg)`;
            });

            laptopContainer.addEventListener('mouseleave', () => {
                isHovering = false;
                const projectInfo = container.querySelector('.project-info');
                if (projectInfo && projectInfo.classList.contains('visible')) {
                    macbook.style.transform = 'scale(1) rotateY(0deg) rotateX(10deg)';
                }
            });
        }

        // iPhone tilt (mobile)
        if (iphoneContainer && iphone) {
            let isHovering = false;

            iphoneContainer.addEventListener('mouseenter', () => {
                isHovering = true;
            });

            iphoneContainer.addEventListener('mousemove', (e) => {
                if (!isHovering) return;

                const projectInfo = container.querySelector('.project-info');
                if (!projectInfo || !projectInfo.classList.contains('visible')) return;

                const rect = iphoneContainer.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                iphone.style.transform = `scale(1) rotateY(${x * 20}deg) rotateX(${-y * 15}deg)`;
            });

            iphoneContainer.addEventListener('mouseleave', () => {
                isHovering = false;
                const projectInfo = container.querySelector('.project-info');
                if (projectInfo && projectInfo.classList.contains('visible')) {
                    iphone.style.transform = 'scale(1) rotateY(0deg) rotateX(8deg)';
                }
            });
        }
    });
}

// Initialize all immersive enhancements
function initImmersiveEffects() {
    initTypingAnimation();
    initHeroParallax();
    initTimelineAnimation();
    initDeviceTilt();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initImmersiveEffects);
} else {
    initImmersiveEffects();
}

// ==================== CONSTELLATION SKILLS ====================
// Pure CSS/SVG implementation - no JS needed
