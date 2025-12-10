// Enhanced Animated Stars Background
class StarField {
    constructor() {
        this.canvas = document.getElementById('stars-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.shootingStars = [];
        this.numStars = 400; // Increased number of stars
        this.numShootingStars = 3;
        
        this.init();
        this.createStars();
        this.createShootingStars();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.init();
            this.createStars();
            this.createShootingStars();
        });
        
        // Update canvas size when content changes
        window.addEventListener('scroll', () => {
            const newHeight = Math.max(window.innerHeight, document.documentElement.scrollHeight);
            if (this.canvas.height !== newHeight) {
                this.canvas.height = newHeight;
            }
        });
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight);
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.position = 'fixed';
    }
    
    createStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 1000 + 100,
                speed: Math.random() * 3 + 1,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.9 + 0.1,
                twinkle: Math.random() * 0.02 + 0.01,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }
    }
    
    createShootingStars() {
        this.shootingStars = [];
        for (let i = 0; i < this.numShootingStars; i++) {
            this.shootingStars.push(this.createShootingStar());
        }
    }
    
    createShootingStar() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height * 0.5,
            speedX: Math.random() * 8 + 4,
            speedY: Math.random() * 4 + 2,
            length: Math.random() * 80 + 20,
            opacity: 1,
            life: 0,
            maxLife: Math.random() * 100 + 50
        };
    }
    
    animate() {
        // Clear with slight trail effect for smoother animation
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Animate regular stars
        this.stars.forEach(star => {
            // Move stars towards viewer with warp effect
            star.z -= star.speed;
            
            // Reset star position when it gets too close
            if (star.z <= 0) {
                star.z = 1000;
                star.x = Math.random() * this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
            
            // Calculate star position and size based on z-depth
            const x = (star.x - this.canvas.width / 2) * (1000 / star.z) + this.canvas.width / 2;
            const y = (star.y - this.canvas.height / 2) * (1000 / star.z) + this.canvas.height / 2;
            let size = star.size * (1000 / star.z) * 0.2;
            
            // Twinkle effect
            star.twinklePhase += star.twinkle;
            const twinkleOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.twinklePhase));
            
            // Draw star with glow effect
            if (x >= -50 && x <= this.canvas.width + 50 && y >= -50 && y <= this.canvas.height + 50) {
                // Main star
                this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Glow effect for brighter stars
                if (size > 1.5) {
                    this.ctx.fillStyle = `rgba(0, 212, 255, ${twinkleOpacity * 0.3})`;
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, size * 2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
                
                // Warp trail effect for fast-moving stars
                if (star.speed > 2) {
                    const prevX = (star.x - this.canvas.width / 2) * (1000 / (star.z + star.speed * 10)) + this.canvas.width / 2;
                    const prevY = (star.y - this.canvas.height / 2) * (1000 / (star.z + star.speed * 10)) + this.canvas.height / 2;
                    
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${twinkleOpacity * 0.5})`;
                    this.ctx.lineWidth = size * 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(prevX, prevY);
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke();
                }
            }
        });
        
        // Animate shooting stars
        this.shootingStars.forEach((shootingStar, index) => {
            shootingStar.life++;
            shootingStar.x += shootingStar.speedX;
            shootingStar.y += shootingStar.speedY;
            shootingStar.opacity = 1 - (shootingStar.life / shootingStar.maxLife);
            
            // Draw shooting star
            if (shootingStar.opacity > 0) {
                this.ctx.strokeStyle = `rgba(0, 212, 255, ${shootingStar.opacity})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(shootingStar.x - shootingStar.length, shootingStar.y);
                this.ctx.lineTo(shootingStar.x, shootingStar.y);
                this.ctx.stroke();
                
                // Glow effect
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity * 0.5})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
            
            // Reset shooting star when it's done
            if (shootingStar.life >= shootingStar.maxLife || 
                shootingStar.x > this.canvas.width + 100 || 
                shootingStar.y > this.canvas.height + 100) {
                this.shootingStars[index] = this.createShootingStar();
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Mobile Navigation Toggle
class Navigation {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        // Add fade-in class to elements
        const elementsToAnimate = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');
        elementsToAnimate.forEach(el => el.classList.add('fade-in'));
        
        // Intersection Observer for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate skill bars when they come into view
                    if (entry.target.classList.contains('skill-card')) {
                        this.animateSkillBar(entry.target);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        elementsToAnimate.forEach(el => this.observer.observe(el));
    }
    
    animateSkillBar(skillCard) {
        const progressBar = skillCard.querySelector('.skill-progress');
        const targetWidth = progressBar.getAttribute('data-width');
        
        setTimeout(() => {
            progressBar.style.width = targetWidth + '%';
        }, 300);
    }
}

// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !message) {
            this.showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        this.showMessage('Thank you! Your message has been sent successfully.', 'success');
        this.form.reset();
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showMessage(text, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        message.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            ${type === 'success' ? 
                'background: rgba(0, 212, 255, 0.2); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.3);' : 
                'background: rgba(255, 0, 0, 0.2); color: #ff6b6b; border: 1px solid rgba(255, 0, 0, 0.3);'
            }
        `;
        
        this.form.appendChild(message);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Navbar Background on Scroll
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                this.navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            }
        });
    }
}

// Typing Animation for Hero Title
class TypingAnimation {
    constructor() {
        this.element = document.querySelector('.hero-title');
        this.text = this.element.innerHTML;
        this.init();
    }
    
    init() {
        this.element.innerHTML = '';
        this.typeText();
    }
    
    typeText() {
        let i = 0;
        const timer = setInterval(() => {
            if (i < this.text.length) {
                this.element.innerHTML += this.text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 100);
    }
}

// Parallax Effect for Sections
class ParallaxEffect {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // Move stars canvas slower than scroll
            const canvas = document.getElementById('stars-canvas');
            canvas.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Particle Effect on Button Hover
class ButtonEffects {
    constructor() {
        this.init();
    }
    
    init() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => this.createParticles(e));
        });
    }
    
    createParticles(e) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00d4ff;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particle-float 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1000);
        }
    }
}

// Add particle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-float {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Initialize all components
    new StarField();
    new Navigation();
    new SmoothScroll();
    new ScrollAnimations();
    new ContactForm();
    new NavbarScroll();
    new ParallaxEffect();
    new ButtonEffects();
    
    // Optional: Add typing animation with delay
    setTimeout(() => {
        // new TypingAnimation();
    }, 500);
    
    // Show content after brief delay
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Additional Interactive Features
class InteractiveFeatures {
    constructor() {
        this.init();
    }
    
    init() {
        // Add glow effect to skill cards on hover
        document.querySelectorAll('.skill-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 15px 35px rgba(0, 212, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.boxShadow = 'none';
            });
        });
        
        // Add click effect to project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px)';
                }, 150);
            });
        });
        
        // Add floating animation to profile image on scroll
        window.addEventListener('scroll', () => {
            const profileImg = document.querySelector('.profile-img');
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.02;
            
            if (profileImg) {
                profileImg.style.transform = `translateY(${Math.sin(rate) * 10}px)`;
            }
        });
    }
}
// Certificates Section JavaScript

class CertificatesManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.certificateCards = document.querySelectorAll('.certificate-card');
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        this.setupFilterButtons();
        this.setupCertificateAnimations();
        this.setupCertificateActions();
        this.updateCertificateCounter();
        this.setupIntersectionObserver();
    }
    
    setupFilterButtons() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterCertificates(filter);
                this.updateActiveFilter(e.target);
            });
        });
    }
    
    filterCertificates(filter) {
        this.currentFilter = filter;
        
        this.certificateCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });
        
        // Update counter after filter animation
        setTimeout(() => {
            this.updateCertificateCounter();
        }, 350);
    }
    
    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    updateCertificateCounter() {
        const visibleCards = document.querySelectorAll('.certificate-card:not(.hidden)').length;
        const totalCards = this.certificateCards.length;
        
        // Create or update counter element
        let counter = document.querySelector('.certificate-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'certificate-counter';
            document.querySelector('.certificates .container').appendChild(counter);
        }
        
        const filterText = this.currentFilter === 'all' ? 'certificates' : `${this.currentFilter} certificates`;
        counter.innerHTML = `Showing <span class="count">${visibleCards}</span> of <span class="count">${totalCards}</span> ${filterText}`;
    }
    
    setupCertificateAnimations() {
        this.certificateCards.forEach((card, index) => {
            // Add staggered animation delay
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effects for certificate icons
            const icon = card.querySelector('.certificate-icon');
            if (icon) {
                icon.addEventListener('mouseenter', () => {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                });
                
                icon.addEventListener('mouseleave', () => {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                });
            }
            
            // Add ripple effect on card click
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
            });
        });
    }
    
    createRippleEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.3);
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${x - 25}px;
            top: ${y - 25}px;
            width: 50px;
            height: 50px;
            z-index: 1000;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    setupCertificateActions() {
        // Handle certificate action buttons
        document.querySelectorAll('.certificate-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card ripple effect
                
                const card = button.closest('.certificate-card');
                const certificateTitle = card.querySelector('.certificate-title').textContent;
                const action = button.classList.contains('btn-verify') ? 'verify' : 'download';
                
                this.handleCertificateAction(action, certificateTitle, button);
            });
        });
    }
    
    handleCertificateAction(action, certificateTitle, button) {
        // Add loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.style.pointerEvents = 'none';
        
        // Simulate action (replace with actual functionality)
        setTimeout(() => {
            if (action === 'verify') {
                this.showNotification(`Verification link for "${certificateTitle}" copied to clipboard!`, 'success');
                // In real implementation, you would open verification URL
                // window.open('verification-url', '_blank');
            } else if (action === 'download') {
                this.showNotification(`Downloading certificate: "${certificateTitle}"`, 'success');
                // In real implementation, you would trigger download
                // this.downloadCertificate(certificateTitle);
            }
            
            // Restore button
            button.innerHTML = originalText;
            button.style.pointerEvents = 'auto';
        }, 1500);
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.certificate-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `certificate-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(0, 212, 255, 0.9)'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;
        
        // Add notification to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Add close functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.closeNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            this.closeNotification(notification);
        }, 5000);
    }
    
    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add special animation for certificate cards
                    if (entry.target.classList.contains('certificate-card')) {
                        this.animateCertificateCard(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all certificate cards
        this.certificateCards.forEach(card => observer.observe(card));
    }
    
    animateCertificateCard(card) {
        const icon = card.querySelector('.certificate-icon');
        const skills = card.querySelectorAll('.skill-badge');
        
        // Animate icon
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            }, 300);
        }
        
        // Animate skill badges with stagger
        skills.forEach((skill, index) => {
            setTimeout(() => {
                skill.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    skill.style.transform = 'translateY(0)';
                }, 200);
            }, 500 + (index * 100));
        });
    }
    
    // Method to add new certificate (for future use)
    addCertificate(certificateData) {
        const certificatesGrid = document.querySelector('.certificates-grid');
        const newCard = this.createCertificateCard(certificateData);
        
        certificatesGrid.appendChild(newCard);
        this.certificateCards = document.querySelectorAll('.certificate-card');
        this.updateCertificateCounter();
        
        // Animate in new card
        setTimeout(() => {
            newCard.classList.add('visible');
        }, 100);
    }
    
    createCertificateCard(data) {
        const card = document.createElement('div');
        card.className = 'certificate-card fade-in';
        card.setAttribute('data-category', data.category);
        
        card.innerHTML = `
            <div class="certificate-header">
                <div class="certificate-icon">
                    <i class="${data.icon}"></i>
                </div>
                <h3 class="certificate-title">${data.title}</h3>
                <p class="certificate-issuer">${data.issuer}</p>
                <span class="certificate-badge ${data.statusClass}">${data.status}</span>
            </div>
            <div class="certificate-body">
                <p class="certificate-description">${data.description}</p>
                <div class="certificate-details">
                    ${data.details.map(detail => `
                        <div class="certificate-detail">
                            <i class="${detail.icon}"></i>
                            <span>${detail.text}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="certificate-skills">
                    ${data.skills.map(skill => `
                        <span class="skill-badge">${skill}</span>
                    `).join('')}
                </div>
                <div class="certificate-actions">
                    <a href="#" class="certificate-btn btn-verify">
                        <i class="fas fa-check-circle"></i> Verify
                    </a>
                    <a href="#" class="certificate-btn btn-download">
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Search functionality
    searchCertificates(query) {
        const searchTerm = query.toLowerCase();
        
        this.certificateCards.forEach(card => {
            const title = card.querySelector('.certificate-title').textContent.toLowerCase();
            const issuer = card.querySelector('.certificate-issuer').textContent.toLowerCase();
            const description = card.querySelector('.certificate-description').textContent.toLowerCase();
            const skills = Array.from(card.querySelectorAll('.skill-badge'))
                .map(skill => skill.textContent.toLowerCase());
            
            const searchContent = [title, issuer, description, ...skills].join(' ');
            
            if (searchContent.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
        
        this.updateCertificateCounter();
    }
}

// Progress Bar Animation for Skills
class ProgressBarAnimator {
    constructor() {
        this.init();
    }
    
    init() {
        const progressBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetWidth = progressBar.getAttribute('data-width');
                    
                    setTimeout(() => {
                        progressBar.style.width = targetWidth + '%';
                    }, 500);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.3 });
        
        progressBars.forEach(bar => observer.observe(bar));
    }
}

// Certificate Statistics
class CertificateStats {
    constructor() {
        this.certificates = document.querySelectorAll('.certificate-card');
        this.init();
    }
    
    init() {
        this.calculateStats();
        this.displayStats();
    }
    
    calculateStats() {
        const stats = {
            total: this.certificates.length,
            verified: document.querySelectorAll('.status-verified').length,
            inProgress: document.querySelectorAll('.status-in-progress').length,
            categories: {}
        };
        
        this.certificates.forEach(card => {
            const category = card.getAttribute('data-category');
            stats.categories[category] = (stats.categories[category] || 0) + 1;
        });
        
        this.stats = stats;
    }
    
    displayStats() {
        // Could be used to show statistics in a dashboard
        console.log('Certificate Statistics:', this.stats);
    }
    
    getStats() {
        return this.stats;
    }
}

// Keyboard Navigation for Certificates
class CertificateKeyboardNav {
    constructor() {
        this.currentIndex = 0;
        this.visibleCards = [];
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.focusSearchInput();
            }
            
            if (e.target.closest('.certificates')) {
                this.handleCertificateNavigation(e);
            }
        });
        
        this.updateVisibleCards();
    }
    
    updateVisibleCards() {
        this.visibleCards = Array.from(document.querySelectorAll('.certificate-card:not(.hidden)'));
    }
    
    handleCertificateNavigation(e) {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.navigateTo('prev');
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.navigateTo('next');
                break;
            case 'Enter':
                e.preventDefault();
                this.selectCertificate();
                break;
        }
    }
    
    navigateTo(direction) {
        this.updateVisibleCards();
        
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % this.visibleCards.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.visibleCards.length) % this.visibleCards.length;
        }
        
        this.highlightCurrentCard();
    }
    
    highlightCurrentCard() {
        // Remove previous highlights
        document.querySelectorAll('.certificate-card.keyboard-focus').forEach(card => {
            card.classList.remove('keyboard-focus');
        });
        
        // Highlight current card
        if (this.visibleCards[this.currentIndex]) {
            this.visibleCards[this.currentIndex].classList.add('keyboard-focus');
            this.visibleCards[this.currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
    
    selectCertificate() {
        if (this.visibleCards[this.currentIndex]) {
            this.visibleCards[this.currentIndex].click();
        }
    }
    
    focusSearchInput() {
        // Create search input if it doesn't exist
        let searchInput = document.querySelector('.certificate-search');
        if (!searchInput) {
            searchInput = this.createSearchInput();
        }
        searchInput.focus();
    }
    
    createSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'certificate-search-container';
        searchContainer.style.cssText = `
            margin-bottom: 2rem;
            text-align: center;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'certificate-search';
        searchInput.placeholder = 'Search certificates... (Ctrl+K)';
        searchInput.style.cssText = `
            padding: 0.8rem 1.5rem;
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 1rem;
            width: 100%;
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;
        
        searchInput.addEventListener('input', (e) => {
            window.certificatesManager.searchCertificates(e.target.value);
        });
        
        searchContainer.appendChild(searchInput);
        
        const filtersContainer = document.querySelector('.certificate-filters');
        filtersContainer.parentNode.insertBefore(searchContainer, filtersContainer);
        
        return searchInput;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Make certificatesManager globally accessible
    window.certificatesManager = new CertificatesManager();
    
    // Initialize other components
    new ProgressBarAnimator();
    new CertificateStats();
    new CertificateKeyboardNav();
});

// CSS for keyboard focus
const keyboardFocusStyles = document.createElement('style');
keyboardFocusStyles.textContent = `
    .certificate-card.keyboard-focus {
        border-color: #00d4ff !important;
        box-shadow: 0 0 20px rgba(0, 212, 255, 0.5) !important;
        transform: scale(1.02) !important;
    }
    
    .certificate-search:focus {
        outline: none;
        border-color: #00d4ff;
        box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.2rem;
        border-radius: 3px;
        transition: background 0.2s;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;
document.head.appendChild(keyboardFocusStyles);

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
        });
        
        this.animate();
    }
    
    addTrailPoint(x, y) {
        this.trail.push({ x, y, age: 0 });
        
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }
    }
    
    animate() {
        // Update trail points
        this.trail.forEach(point => {
            point.age++;
        });
        
        // Remove old points
        this.trail = this.trail.filter(point => point.age < this.maxTrail);
        
        requestAnimationFrame(() => this.animate());
    }
}

// Keyboard Navigation
class KeyboardNavigation {
    constructor() {
        this.sections = ['home', 'about', 'skills', 'projects', 'contact'];
        this.currentSection = 0;
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.navigateUp();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.navigateDown();
                        break;
                }
            }
        });
    }
    
    navigateUp() {
        this.currentSection = Math.max(0, this.currentSection - 1);
        this.scrollToSection();
    }
    
    navigateDown() {
        this.currentSection = Math.min(this.sections.length - 1, this.currentSection + 1);
        this.scrollToSection();
    }
    
    scrollToSection() {
        const targetSection = document.getElementById(this.sections[this.currentSection]);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.lastTime = performance.now();
        this.init();
    }
    
    init() {
        this.monitor();
    }
    
    monitor() {
        const now = performance.now();
        this.fps = Math.round(1000 / (now - this.lastTime));
        this.lastTime = now;
        
        // Adjust star count based on performance (but keep minimum visible stars)
        if (this.fps < 30) {
            const starField = window.starField;
            if (starField && starField.numStars > 250) {
                starField.numStars = 250;
                starField.createStars();
            }
        } else if (this.fps > 50) {
            const starField = window.starField;
            if (starField && starField.numStars < 400) {
                starField.numStars = Math.min(400, starField.numStars + 10);
                starField.createStars();
            }
        }
        
        requestAnimationFrame(() => this.monitor());
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveFeatures();
    new MouseTrail();
    new KeyboardNavigation();
    new PerformanceMonitor();
});

// Utility Functions
const utils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Random number generator
    random: (min, max) => Math.random() * (max - min) + min
};

// Export starField for performance monitoring
window.starField = null;

// Update StarField initialization
document.addEventListener('DOMContentLoaded', () => {
    window.starField = new StarField();
});