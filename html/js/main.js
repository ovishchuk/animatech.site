// Initialize Lucide icons
lucide.createIcons();

// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.getElementById('mobile-menu').classList.add('hidden');
        }
    });
});

// Form submission handler
document.getElementById('order-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Відправка...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('Замовлення успішно відправлено!', 'success');
            this.reset();
        } else {
            throw new Error('Помилка відправки');
        }
    } catch (error) {
        showMessage('Помилка відправки замовлення. Спробуйте ще раз.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Show message function
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('order-form');
    form.parentNode.insertBefore(messageDiv, form);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Add scroll effects
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Re-initialize Lucide icons after dynamic content
    lucide.createIcons();
    
    // Initialize animations from animations.js
    try {
        createCircuitBoard();
    } catch (e) {
        console.log('Circuit board animation not available:', e);
    }
    
    // Initialize particle system for hero section
    const heroSection = document.getElementById('home');
    if (heroSection) {
        try {
            new ParticleSystem(heroSection);
        } catch (e) {
            console.log('Particle system not available:', e);
        }
    }
    
    // Add glitch effect to neon text
    const neonTexts = document.querySelectorAll('.text-neon-glow');
    try {
        neonTexts.forEach(text => {
            addGlitchEffect(text);
        });
    } catch (e) {
        console.log('Glitch effect not available:', e);
    }
    
    // Initialize neon signs controller
    try {
        new NeonSignsController();
    } catch (e) {
        console.log('Neon signs controller not available:', e);
    }
    
    // Initialize parallax effects
    try {
        initParallax();
    } catch (e) {
        console.log('Parallax not available:', e);
    }
    
    // Initialize custom cursor
    if (window.innerWidth > 768) {
        try {
            initCustomCursor();
        } catch (e) {
            console.log('Custom cursor not available:', e);
        }
    }
    
    // Add entrance animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    });
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
