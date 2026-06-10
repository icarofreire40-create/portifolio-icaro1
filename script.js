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
    document.body.style.overflow = $mobileNav.classList.contains('active') ? 'hidden' : '';
}

$hamburger.addEventListener('click', toggleMobileNav);
$hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileNav();
    }
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        $hamburger.classList.remove('active');
        $mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/*======================
CURSOR PERSONALIZADO
======================*/
const cursor = document.createElement('div');
const cursorDot = document.createElement('div');
cursor.id = 'cursor';
cursorDot.id = 'cursor-dot';
document.body.appendChild(cursor);
document.body.appendChild(cursorDot);

let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top  = cursorY + 'px';
});

function animateCursor() {
    dotX += (cursorX - dotX) * 0.12;
    dotY += (cursorY - dotY) * 0.12;
    cursor.style.left = dotX + 'px';
    cursor.style.top  = dotY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Aumenta cursor em elementos clicáveis
document.querySelectorAll('a, button, .btn, .img-card, .stat-pill, .toggle').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// Esconde cursor ao sair da janela
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
});

/*======================
NEURAL BACKGROUND
======================*/
const canvas = document.getElementById("neural-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = { x: undefined, y: undefined, radius: 120 };

window.addEventListener("mousemove", (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener("mouseleave", () => { mouse.x = undefined; mouse.y = undefined; });
window.addEventListener("touchmove", (e) => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
}, { passive: true });
window.addEventListener("touchend", () => { mouse.x = undefined; mouse.y = undefined; });
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

class Particle {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 1.5 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x <= 0 || this.x >= canvas.width)  this.vx *= -1;
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
        ctx.fillStyle = "rgba(212,175,55,0.8)";
        ctx.fill();
    }
}

const particles = [];

function initParticles() {
    particles.length = 0;
    const isMobile = window.innerWidth < 730;
    const amount = Math.min(Math.floor(window.innerWidth / (isMobile ? 20 : 14)), isMobile ? 60 : 120);
    for (let i = 0; i < amount; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
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
                ctx.strokeStyle = `rgba(212,175,55,${opacity})`;
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
    for (const particle of particles) { particle.update(); particle.draw(); }
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
        if (entry.isIntersecting) entry.target.classList.add('show');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => observer.observe(section));

/*======================
SCROLL REVEAL ESCALONADO
======================*/
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

const revealTargets = document.querySelectorAll(
    '.edu-list .item, .bar, .experience-card, .portfolio-list .img-card, .about-info, .about-img, .timeline-item'
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
BOTÃO VOLTAR AO TOPO
======================*/
const backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.setAttribute('aria-label', 'Voltar ao topo');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/*======================
CONTADOR ANIMADO NOS STATS
======================*/
function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const isPlus = el.dataset.target.includes('+');
    const isPercent = el.dataset.target.includes('%');
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        start = Math.floor(eased * target);
        el.textContent = start + (isPlus ? '+' : isPercent ? '%' : '');
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const raw = el.dataset.target.replace(/[^0-9]/g, '');
            animateCounter(el, parseInt(raw));
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-pill strong').forEach(el => {
    const text = el.textContent.trim();
    el.dataset.target = text;
    el.textContent = '0';
    statsObserver.observe(el);
});

/*======================
TYPED TEXT ANIMATION — MELHORADO
======================*/
const textos = ['Desenvolvedor', 'Web Designer', 'Freelancer', 'Criador de Soluções'];
let textoAtual = 0;
let letra = 0;
let deletando = false;
let pausando = false;

function tipar() {
    const elemento = document.querySelector('.home-container .info h3');
    if (!elemento) return;

    const texto = textos[textoAtual];

    if (pausando) return;

    if (!deletando) {
        letra++;
        elemento.innerHTML = `${texto.substring(0, letra)}<span class="typed-cursor">|</span>`;

        if (letra === texto.length) {
            pausando = true;
            setTimeout(() => {
                pausando = false;
                deletando = true;
                tipar();
            }, 2000);
            return;
        }
    } else {
        letra--;
        elemento.innerHTML = `${texto.substring(0, letra)}<span class="typed-cursor">|</span>`;

        if (letra === 0) {
            deletando = false;
            textoAtual = (textoAtual + 1) % textos.length;
            setTimeout(tipar, 400);
            return;
        }
    }

    setTimeout(tipar, deletando ? 50 : 100);
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

/* ============================================================
   ABOUT TERMINAL — Animação de digitação
============================================================ */
 
(function () {
 
  /* ----------------------------------------------------------
     1. DADOS — edite aqui suas informações reais
  ---------------------------------------------------------- */
  const TERMINAL_LINES = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'output', html: '<span class="abt-gold">Ícaro Freire</span> — Dev Web Jr.' },
    { type: 'blank' },
 
    { type: 'cmd',    text: 'cat sobre.json' },
    { type: 'output', html: '{' },
    { type: 'output', html: '  <span class="abt-key">"localização"</span>: <span class="abt-val">"Goiânia, GO"</span>,' },
    { type: 'output', html: '  <span class="abt-key">"foco"</span>: <span class="abt-val">"Fullstack & Web Design"</span>,' },
    { type: 'output', html: '  <span class="abt-key">"experiência"</span>: <span class="abt-val">"2+ anos"</span>,' },
    { type: 'output', html: '  <span class="abt-key">"projetos"</span>: <span class="abt-val">10+</span>,' },
    { type: 'output', html: '  <span class="abt-key">"dedicação"</span>: <span class="abt-val">"100%"</span>' },
    { type: 'output', html: '}' },
    { type: 'blank' },
 
    { type: 'cmd',    text: 'ls habilidades/' },
    { type: 'output', html: '<span class="abt-val">HTML</span>  <span class="abt-val">CSS</span> <span class="abt-val">UX/UI Design</span>  <span class="abt-val">TypeScript</span>  <span class="abt-val">React</span>  <span class="abt-val"></span>' },
    { type: 'blank' },
 
    { type: 'cmd',    text: 'echo $STATUS' },
    { type: 'output', html: '🟢 <span class="abt-gold">Disponível para novos projetos</span>' },
    { type: 'blank' },
  ];
 
  /* ----------------------------------------------------------
     2. VELOCIDADES (ms)
  ---------------------------------------------------------- */
  const SPEED_TYPE   = 55;   // ms por caractere ao digitar
  const DELAY_AFTER_CMD    = 160;  // pausa após terminar de digitar comando
  const DELAY_AFTER_OUTPUT = 35;   // pausa entre linhas de output
  const DELAY_BLANK        = 120;  // pausa para linha em branco
  const DELAY_START        = 600;  // espera antes de começar
 
  /* ----------------------------------------------------------
     3. HELPERS
  ---------------------------------------------------------- */
  const body = document.getElementById('abt-body');
  if (!body) return; // segurança caso o elemento não exista
 
  function appendLine(html, extraClass) {
    const el = document.createElement('div');
    el.className = 'abt-line' + (extraClass ? ' ' + extraClass : '');
    el.innerHTML = html;
    body.appendChild(el);
    return el;
  }
 
  function appendBlank() {
    const el = document.createElement('div');
    el.className = 'abt-blank';
    body.appendChild(el);
  }
 
  /* Cursor piscante permanente no fim */
  function appendCursor() {
    const el = document.createElement('div');
    el.className = 'abt-line';
    el.style.opacity = '1';
    el.innerHTML = '<span class="abt-prompt">❯ </span><span class="abt-cursor"></span>';
    body.appendChild(el);
  }
 
  /* Digita um comando caractere por caractere */
  function typeCommand(text, callback) {
    const el = document.createElement('div');
    el.className = 'abt-line abt-line-cmd';
    el.style.opacity = '1'; // visível desde o início (cursor aparece)
    el.innerHTML = '<span class="abt-prompt">❯ </span><span class="abt-cmd"></span>';
    body.appendChild(el);
 
    const cmdSpan = el.querySelector('.abt-cmd');
    let i = 0;
 
    function tick() {
      i++;
      const slice = text.slice(0, i);
      const isLast = i >= text.length;
      cmdSpan.innerHTML = slice + (isLast ? '' : '<span class="abt-cursor"></span>');
      if (!isLast) {
        setTimeout(tick, SPEED_TYPE + (Math.random() * 20 - 10)); // leve variação humana
      } else {
        setTimeout(callback, DELAY_AFTER_CMD);
      }
    }
 
    setTimeout(tick, 80);
  }
 
  /* ----------------------------------------------------------
     4. LOOP PRINCIPAL
  ---------------------------------------------------------- */
  let idx = 0;
 
  function runNext() {
    if (idx >= TERMINAL_LINES.length) {
      appendCursor();
      return;
    }
 
    const line = TERMINAL_LINES[idx++];
 
    if (line.type === 'blank') {
      appendBlank();
      setTimeout(runNext, DELAY_BLANK);
      return;
    }
 
    if (line.type === 'cmd') {
      typeCommand(line.text, runNext);
      return;
    }
 
    if (line.type === 'output') {
      appendLine(line.html);
      setTimeout(runNext, DELAY_AFTER_OUTPUT);
      return;
    }
  }
 
  /* ----------------------------------------------------------
     5. DISPARA APENAS QUANDO A SEÇÃO ENTRAR NA VIEWPORT
        (usa o mesmo IntersectionObserver do restante do site)
  ---------------------------------------------------------- */
  let started = false;
 
  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        terminalObserver.disconnect();
        setTimeout(runNext, DELAY_START);
      }
    });
  }, { threshold: 0.3 });
 
  const terminalWrapper = document.querySelector('.about-terminal');
  if (terminalWrapper) {
    terminalObserver.observe(terminalWrapper);
    /* Também registra no revealObserver já existente no site
       para ganhar a classe .visible e acionar a animação CSS */
    revealObserver.observe(terminalWrapper);
  }
 
})();