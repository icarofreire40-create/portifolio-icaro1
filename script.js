const $html = document.querySelector('html');
const $checkbox = document.querySelector('#switch');
const $checkboxMobile = document.querySelector('#switch-mobile');
const $hamburger = document.getElementById('hamburger');
const $mobileNav = document.getElementById('mobile-nav');

/*======================
DARK MODE (desktop toggle)
======================*/

$checkbox.addEventListener('change', function () {
    if (this.checked) {
        $html.classList.add('dark-mode');
        $checkboxMobile.checked = true;
    } else {
        $html.classList.remove('dark-mode');
        $checkboxMobile.checked = false;
    }
});

/*======================
DARK MODE (mobile toggle)
======================*/

$checkboxMobile.addEventListener('change', function () {
    if (this.checked) {
        $html.classList.add('dark-mode');
        $checkbox.checked = true;
    } else {
        $html.classList.remove('dark-mode');
        $checkbox.checked = false;
    }
});

/*======================
HAMBURGER MENU
======================*/

function toggleMobileNav() {
    $hamburger.classList.toggle('active');
    $mobileNav.classList.toggle('active');
    // Prevent body scroll when menu open
    document.body.style.overflow = $mobileNav.classList.contains('active') ? 'hidden' : '';
}

$hamburger.addEventListener('click', toggleMobileNav);

$hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileNav();
    }
});

// Close menu when a mobile nav link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        $hamburger.classList.remove('active');
        $mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/*======================
NEURAL BACKGROUND
======================*/

const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: undefined,
    y: undefined,
    radius: 120
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener("mouseleave", () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Touch support for neural background
window.addEventListener("touchmove", (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
}, { passive: true });

window.addEventListener("touchend", () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.5 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;

        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                this.x += Math.cos(angle) * force * 1.2;
                this.y += Math.sin(angle) * force * 1.2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245,213,76,0.8)";
        ctx.fill();
    }
}

const particles = [];

function initParticles() {
    particles.length = 0;
    // Fewer particles on mobile for performance
    const isMobile = window.innerWidth < 730;
    const amount = Math.min(
        Math.floor(window.innerWidth / (isMobile ? 20 : 14)),
        isMobile ? 60 : 120
    );

    for (let i = 0; i < amount; i++) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = dx * dx + dy * dy;

            if (distance < 8000) {
                const opacity = 1 - distance / 8000;
                ctx.strokeStyle = `rgba(245,213,76,${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const particle of particles) {
        particle.update();
        particle.draw();
    }

    connectParticles();
    requestAnimationFrame(animate);
}

initParticles();
animate();

/*======================
SCROLL ANIMATION (seções)
======================*/

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

/*======================
SCROLL REVEAL ESCALONADO (cards e itens)
======================*/

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // anima só uma vez
        }
    });
}, { threshold: 0.15 });

const revealTargets = document.querySelectorAll(
    '.edu-list .item, .bar, .experience-card, .portfolio-list .img-card, .about-info, .about-img'
);
revealTargets.forEach(el => revealObserver.observe(el));

/*======================
BARRA DE PROGRESSO DE SCROLL
======================*/

const scrollBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = progress + '%';
}, { passive: true });

/*======================
TYPED TEXT ANIMATION
======================*/

const textos = ['Desenvolvedor', 'Web Designer', 'Freelancer'];
let textoAtual = 0;
let letra = 0;
let deletando = false;

function tipar() {
    const elemento = document.querySelector('.home-container .info h3');
    if (!elemento) return;

    const texto = textos[textoAtual];

    if (!deletando) {
        elemento.textContent = texto.substring(0, letra + 1) + '|';
        letra++;

        if (letra === texto.length) {
            deletando = true;
            setTimeout(tipar, 1500);
            return;
        }
    } else {
        elemento.textContent = texto.substring(0, letra - 1) + '|';
        letra--;

        if (letra === 0) {
            deletando = false;
            textoAtual = (textoAtual + 1) % textos.length;
        }
    }

    setTimeout(tipar, deletando ? 60 : 120);
}

tipar();

/*======================
LOADING SCREEN
======================*/

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hide');
    }, 1800);
});