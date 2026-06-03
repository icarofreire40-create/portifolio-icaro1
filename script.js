

const $html = document.querySelector('html');
const $checkbox = document.querySelector('#switch');


/*======================
DARK MODE
======================*/

$checkbox.addEventListener('change', function () {
    if (this.checked) {
        $html.classList.add('dark-mode');
    } else {
        $html.classList.remove('dark-mode');
    }
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

        // Rebater nas bordas
        if (this.x <= 0 || this.x >= canvas.width) {
            this.vx *= -1;
        }

        if (this.y <= 0 || this.y >= canvas.height) {
            this.vy *= -1;
        }

        // Atração do mouse
        if (mouse.x && mouse.y) {

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {

                const angle = Math.atan2(dy, dx);

                const force =
                    (mouse.radius - distance) / mouse.radius;

                this.x += Math.cos(angle) * force * 1.2;
                this.y += Math.sin(angle) * force * 1.2;
            }
        }
    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(245,213,76,0.8)";

        ctx.fill();
    }
}

const particles = [];

/*======================
CRIAR PARTÍCULAS
======================*/

function initParticles() {

    particles.length = 0;

    const amount = Math.min(
        Math.floor(window.innerWidth / 14),
        120
    );

    for (let i = 0; i < amount; i++) {

        particles.push(
            new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            )
        );
    }
}

/*======================
CONECTAR PARTÍCULAS
======================*/

function connectParticles() {

    for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

            const dx =
                particles[a].x - particles[b].x;

            const dy =
                particles[a].y - particles[b].y;

            const distance = dx * dx + dy * dy;

            if (distance < 8000) {

                const opacity =
                    1 - distance / 8000;

                ctx.strokeStyle =
                    `rgba(245,213,76,${opacity})`;

                ctx.lineWidth = 0.5;

                ctx.beginPath();

                ctx.moveTo(
                    particles[a].x,
                    particles[a].y
                );

                ctx.lineTo(
                    particles[b].x,
                    particles[b].y
                );

                ctx.stroke();
            }
        }
    }
}

/*======================
ANIMAÇÃO
======================*/

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

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
ANIMAÇÃO DE ENTRADA
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
TIPAGEM ANIMADA
======================*/

const textos = ['Desenvolvedor', 'Web Designer', 'Freelancer'];
let textoAtual = 0;
let letra = 0;
let deletando = false;

function tipar() {
    const elemento = document.querySelector('.home-container .info h3');
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
LOADING
======================*/

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hide');
    }, 1800);
});