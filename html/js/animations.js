// Advanced animations and effects

// Typing effect for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Matrix rain effect
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.1';
    canvas.style.zIndex = '1';
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for(let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for(let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    document.body.appendChild(canvas);
}

// Circuit board animation with chips and signals
function createCircuitBoard() {
    const container = document.createElement('div');
    container.className = 'circuit-paths';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '1';
    
    // Add circuit board grid
    const board = document.createElement('div');
    board.className = 'circuit-board';
    container.appendChild(board);
    
    // Create circuit paths (wires)
    const paths = [];
    
    // Horizontal paths
    for (let i = 0; i < 12; i++) {
        const path = document.createElement('div');
        path.className = 'circuit-path circuit-path-horizontal';
        path.style.top = Math.random() * 100 + '%';
        path.style.left = Math.random() * 80 + '%';
        path.style.width = Math.random() * 150 + 50 + 'px';
        container.appendChild(path);
        paths.push({element: path, type: 'horizontal'});
    }
    
    // Vertical paths
    for (let i = 0; i < 8; i++) {
        const path = document.createElement('div');
        path.className = 'circuit-path circuit-path-vertical';
        path.style.left = Math.random() * 100 + '%';
        path.style.top = Math.random() * 80 + '%';
        path.style.height = Math.random() * 150 + 50 + 'px';
        container.appendChild(path);
        paths.push({element: path, type: 'vertical'});
    }
    
    // Create chips (microchips)
    const chips = [];
    for (let i = 0; i < 15; i++) {
        const chip = document.createElement('div');
        chip.className = 'circuit-chip';
        chip.style.top = Math.random() * 90 + 5 + '%';
        chip.style.left = Math.random() * 90 + 5 + '%';
        container.appendChild(chip);
        chips.push(chip);
    }
    
    // Create signal particles that travel along paths
    function createSignal() {
        if (paths.length === 0) return;
        
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        const particle = document.createElement('div');
        particle.className = 'signal-particle';
        
        const duration = 2000 + Math.random() * 2000; // 2-4 seconds
        particle.style.animation = `signal-flow ${duration}ms linear`;
        
        if (randomPath.type === 'horizontal') {
            const rect = randomPath.element.getBoundingClientRect();
            particle.style.left = rect.left + 'px';
            particle.style.top = rect.top + rect.height/2 - 2 + 'px';
            
            // Animate along the path
            let progress = 0;
            const animate = () => {
                progress += 16 / duration; // 60fps
                if (progress <= 1) {
                    const x = rect.left + (rect.width * progress);
                    particle.style.left = x + 'px';
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            animate();
        } else {
            const rect = randomPath.element.getBoundingClientRect();
            particle.style.left = rect.left + rect.width/2 - 2 + 'px';
            particle.style.top = rect.top + 'px';
            
            // Animate along vertical path
            let progress = 0;
            const animate = () => {
                progress += 16 / duration;
                if (progress <= 1) {
                    const y = rect.top + (rect.height * progress);
                    particle.style.top = y + 'px';
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            animate();
        }
        
        container.appendChild(particle);
    }
    
    // Create signals periodically
    setInterval(createSignal, 300);
    
    document.body.appendChild(container);
}

// Particle system
class ParticleSystem {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.container.appendChild(this.canvas);
        window.addEventListener('resize', () => this.resize());
        
        this.createParticles();
        this.animate();
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: Math.random() > 0.5 ? '#00ffff' : '#ff00ff',
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// About Section Neon Signs Animation
class NeonSignsController {
    constructor() {
        this.blocks = document.querySelectorAll('.about-block');
        this.signs = document.querySelectorAll('.neon-sign');
        this.currentIndex = 0;
        this.intervalDuration = 3500; // 3.5 seconds
        this.isAnimating = false;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        if (this.blocks.length === 0 || this.signs.length === 0) return;
        
        console.log('NeonSignsController initialized');
        console.log('Blocks found:', this.blocks.length);
        console.log('Signs found:', this.signs.length);
        
        // Start with first block and sign
        this.showBlock(0);
        
        // Start automatic cycling
        this.startAutoPlay();
        
        // Add hover interactions
        this.addHoverInteractions();
        
        // Pause on page visibility change
        this.addVisibilityListener();
    }
    
    showBlock(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        console.log('Showing block:', index);
        this.isAnimating = true;
        
        // Get current and next elements
        const currentBlock = this.blocks[this.currentIndex];
        const currentSign = this.signs[this.currentIndex];
        const nextBlock = this.blocks[index];
        const nextSign = this.signs[index];
        
        // Remove active class from current elements
        currentBlock.classList.remove('active');
        currentSign.classList.remove('active');
        
        // Add morphing out class to current sign
        currentSign.classList.add('morphing-out');
        
        // After a short delay, show next elements
        setTimeout(() => {
            // Hide current sign completely
            currentSign.classList.remove('morphing-out');
            currentSign.classList.add('hidden');
            
            // Show next sign with morphing in effect
            nextSign.classList.remove('hidden');
            nextSign.classList.add('morphing-in');
            
            // Add active class to next elements
            nextBlock.classList.add('active');
            
            // Remove morphing class and add active
            setTimeout(() => {
                nextSign.classList.remove('morphing-in');
                nextSign.classList.add('active');
                this.isAnimating = false;
                console.log('Block transition completed:', index);
            }, 800);
        }, 400);
        
        this.currentIndex = index;
    }
    
    nextBlock() {
        const nextIndex = (this.currentIndex + 1) % this.blocks.length;
        this.showBlock(nextIndex);
    }
    
    startAutoPlay() {
        console.log('Starting autoplay');
        this.autoPlayInterval = setInterval(() => {
            this.nextBlock();
        }, this.intervalDuration);
    }
    
    stopAutoPlay() {
        console.log('Stopping autoplay');
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    addHoverInteractions() {
        this.blocks.forEach((block, index) => {
            block.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
                this.showBlock(index);
            });
            
            block.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        });
    }
    
    addVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
    }
}

// Glitch effect for text
function addGlitchEffect(element) {
    const originalText = element.textContent;
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            let glitchedText = '';
            
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() > 0.8) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            element.textContent = glitchedText;
            
            setTimeout(() => {
                element.textContent = originalText;
            }, 100);
        }
    }, 3000);
}

// Parallax scrolling effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Remove duplicate DOMContentLoaded listener since it's handled in main.js
// All animations will be initialized from main.js

// Smooth scrolling for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Cyberpunk cursor effect
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #00ffff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    cursorTrail.style.cssText = `
        position: fixed;
        width: 40px;
        height: 40px;
        border: 1px solid #ff00ff;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.3s ease;
        opacity: 0.5;
        mix-blend-mode: difference;
    `;
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorTrail);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        
        cursorTrail.style.left = e.clientX - 20 + 'px';
        cursorTrail.style.top = e.clientY - 20 + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'scale(0.8)';
        cursorTrail.style.transform = 'scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'scale(1)';
        cursorTrail.style.transform = 'scale(1)';
    });
}

// Initialize custom cursor on desktop
if (window.innerWidth > 768) {
    initCustomCursor();
}
