const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    const xDot = gsap.quickSetter(cursorDot, "x", "px");
    const yDot = gsap.quickSetter(cursorDot, "y", "px");
    const xOutline = gsap.quickSetter(cursorOutline, "x", "px");
    const yOutline = gsap.quickSetter(cursorOutline, "y", "px");

    window.addEventListener('mousemove', e => {
        xDot(e.clientX);
        yDot(e.clientY);
        xOutline(e.clientX - 15);
        yOutline(e.clientY - 15);
    });

    document.querySelectorAll('a, button, .absen-box').forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(cursorOutline, { scale: 1.5, backgroundColor: "rgba(59, 130, 246, 0.1)", duration: 0.3 }));
        el.addEventListener('mouseleave', () => gsap.to(cursorOutline, { scale: 1, backgroundColor: "transparent", duration: 0.3 }));
    });
}

window.addEventListener("load", () => {
    const tl = gsap.timeline();
    
    tl.to("#loading-screen", {
        opacity: 0,
        duration: 1,
        delay: 1.5, 
        onComplete: () => {
            document.getElementById("loading-screen").style.visibility = "hidden";
            jalankanAnimasiHero();
        }
    });
});

function jalankanAnimasiHero() {
    const tlHero = gsap.timeline();

    tlHero.from(".navbar", { y: -100, opacity: 0, duration: 1, ease: "power4.out" })
          .from(".hero-text h1", { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 50, duration: 1 }, "-=0.5")
          .from(".hero-text p", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
          .from(".hero-image", { x: 100, opacity: 0, duration: 1.2, ease: "power2.out" }, "-=1");
}

const navLinks = document.querySelectorAll('.nav-menu li a');
const navHoverBg = document.querySelector('.nav-hover-bg');

if (navHoverBg) {
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            const rect = e.target.getBoundingClientRect();
            const parentRect = e.target.closest('.nav-menu').getBoundingClientRect();
            
            gsap.to(navHoverBg, {
                opacity: 1,
                scale: 1,
                left: rect.left - parentRect.left,
                width: rect.width,
                height: rect.height,
                duration: 0.4,
                ease: "power3.out"
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(navHoverBg, { opacity: 0, scale: 0.8, duration: 0.3 });
        });
    });
}

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
    start: "top -50",
    onUpdate: (self) => {
        const nav = document.querySelector('.navbar');
        self.direction === 1 ? nav.classList.add('scrolled') : nav.classList.remove('scrolled');
    }
});

const revealElements = document.querySelectorAll('.reveal-otomatis, .section-title, .card, .absen-box');
revealElements.forEach((el) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
        },
        y: 50,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
        ease: "power2.out"
    });
});

if(document.querySelector('.hero')) {
    gsap.to(".hero-image img", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            scrub: true
        }
    });
}

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        
        gsap.to(navMenu, {
            clipPath: isActive ? "circle(150% at 100% 0%)" : "circle(0% at 100% 0%)",
            duration: 0.7,
            ease: "power3.inOut"
        });
    });
}

const elemenSentuh = document.querySelectorAll('.absen-box, .pelajaran-card, .card');

elemenSentuh.forEach(el => {
    el.addEventListener('click', () => {
        gsap.fromTo(el, 
            { scale: 0.8, rotation: "random(-15, 15)" }, 
            { scale: 1, rotation: 0, duration: 1, ease: "elastic.out(1, 0.3)" }
        );
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });
});

if (typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '-2'; 
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500; 
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10; 
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('touchmove', (event) => {
        mouseX = event.touches[0].clientX / window.innerWidth - 0.5;
        mouseY = event.touches[0].clientY / window.innerHeight - 0.5;
    });

    window.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += mouseX * 0.05;
        particlesMesh.rotation.x += mouseY * 0.05;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}