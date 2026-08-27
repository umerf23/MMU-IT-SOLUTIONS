    // ────────────────────────────────────────
    // Mobile Navigation
    // ────────────────────────────────────────
    function setMobileNav(open) {
      const nav = document.getElementById('mobile-nav');
      const toggle = document.getElementById('mobile-toggle');
      if (!nav) return;

      nav.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';

      if (toggle) {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }
    }

    function closeMobileNav() {
      setMobileNav(false);
    }

    document.addEventListener('DOMContentLoaded', function () {
      const mobileToggle = document.getElementById('mobile-toggle');
      const mobileNav = document.getElementById('mobile-nav');
      if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function () {
          setMobileNav(!mobileNav.classList.contains('active'));
        });
      }

      // Escape closes the menu, which keyboard users expect.
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('active')) {
          closeMobileNav();
          if (mobileToggle) mobileToggle.focus();
        }
      });

      // Keep the footer copyright year current without editing HTML each January.
      const yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = String(new Date().getFullYear());

      // ────────────────────────────────────────
      // CSS Floating Particles
      // ────────────────────────────────────────
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const particlesContainer = document.getElementById('particles');

      if (!prefersReducedMotion && particlesContainer) {
        for (let i = 0; i < 30; i++) {
          const p = document.createElement('div');
          p.className = 'particle';
          p.style.left = Math.random() * 100 + '%';
          p.style.animationDuration = (15 + Math.random() * 25) + 's';
          p.style.animationDelay = Math.random() * 20 + 's';
          p.style.opacity = (0.1 + Math.random() * 0.2).toString();
          p.style.width = (1 + Math.random() * 2) + 'px';
          p.style.height = p.style.width;
          particlesContainer.appendChild(p);
        }
      }

      // ────────────────────────────────────────
      // Three.js Hero Scene
      // ────────────────────────────────────────
      const isMobile = window.innerWidth < 768;
      const canvas = document.getElementById('hero-canvas');

      if (!isMobile && !prefersReducedMotion && typeof THREE !== 'undefined' && canvas) {
        initHeroScene(canvas);
      }

      // ────────────────────────────────────────
      // GSAP Scroll Animations
      // ────────────────────────────────────────
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
        gsap.registerPlugin(ScrollTrigger);

        // Reveal animations
        gsap.utils.toArray('.reveal').forEach(function (el) {
          gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
            }
          );
        });

        gsap.utils.toArray('.reveal-left').forEach(function (el) {
          gsap.fromTo(el,
            { opacity: 0, x: -40 },
            {
              opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
            }
          );
        });

        // Service cards stagger
        var serviceCards = gsap.utils.toArray('#services .service-card');
        if (serviceCards.length > 0) {
          gsap.fromTo(serviceCards,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out',
              scrollTrigger: { trigger: '#services .services-grid', start: 'top 85%' }
            }
          );
        }

        // Timeline beam animation
        var timelineBeam = document.getElementById('timeline-beam');
        if (timelineBeam) {
          gsap.fromTo(timelineBeam,
            { height: '0%' },
            {
              height: '100%', duration: 1.5, ease: 'power2.out',
              scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: 1 }
            }
          );
        }

        // Workflow pipeline stagger
        var workflowCards = gsap.utils.toArray('.workflow-card');
        if (workflowCards.length > 0) {
          gsap.fromTo(workflowCards,
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out',
              scrollTrigger: { trigger: '.workflow-pipeline', start: 'top 85%' }
            }
          );
        }

        // Feature cards stagger
        var featureCards = gsap.utils.toArray('.feature-card');
        if (featureCards.length > 0) {
          gsap.fromTo(featureCards,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
              scrollTrigger: { trigger: '.features-grid', start: 'top 85%' }
            }
          );
        }

      } else {
        // No GSAP: make everything visible
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }

      // ────────────────────────────────────────
      // Vanilla Tilt Init
      // ────────────────────────────────────────
      if (typeof VanillaTilt !== 'undefined' && !isMobile && !prefersReducedMotion) {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
          max: 8,
          speed: 400,
          glare: true,
          'max-glare': 0.1,
          perspective: 1000,
        });
      }
    });

    // ────────────────────────────────────────
    // Three.js AI Network Visualization
    // ────────────────────────────────────────
    function initHeroScene(canvas) {
      var container = document.getElementById('hero-visual-container');
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.z = 8;

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Central AI core orb
      var coreGeometry = new THREE.SphereGeometry(0.6, 32, 32);
      var coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.6,
      });
      var coreOrb = new THREE.Mesh(coreGeometry, coreMaterial);
      scene.add(coreOrb);

      // Core glow
      var glowGeometry = new THREE.SphereGeometry(0.9, 32, 32);
      var glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.08,
      });
      var glowOrb = new THREE.Mesh(glowGeometry, glowMaterial);
      scene.add(glowOrb);

      // Outer glow ring
      var ringGeometry = new THREE.RingGeometry(1.0, 1.15, 64);
      var ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      var ring = new THREE.Mesh(ringGeometry, ringMaterial);
      scene.add(ring);

      // Satellite nodes
      var nodeLabels = ['LEADS', 'WHATSAPP', 'VOICE', 'CRM', 'BOOKING', 'FOLLOW-UP'];
      var nodeColors = [0x3b82f6, 0x22c55e, 0x8b5cf6, 0x06b6d4, 0xec4899, 0xf59e0b];
      var nodePositions = [];
      var nodeMeshes = [];
      var radius = 3.2;

      nodeLabels.forEach(function (label, i) {
        var angle = (i / nodeLabels.length) * Math.PI * 2 - Math.PI / 2;
        var x = Math.cos(angle) * radius;
        var y = Math.sin(angle) * radius;

        var nodeGeo = new THREE.SphereGeometry(0.22, 16, 16);
        var nodeMat = new THREE.MeshBasicMaterial({
          color: nodeColors[i],
          transparent: true,
          opacity: 0.8,
        });
        var node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(x, y, 0);
        scene.add(node);
        nodeMeshes.push(node);
        nodePositions.push({ x: x, y: y, angle: angle });

        // Node glow
        var nodeGlowGeo = new THREE.SphereGeometry(0.35, 16, 16);
        var nodeGlowMat = new THREE.MeshBasicMaterial({
          color: nodeColors[i],
          transparent: true,
          opacity: 0.1,
        });
        var nodeGlow = new THREE.Mesh(nodeGlowGeo, nodeGlowMat);
        nodeGlow.position.set(x, y, 0);
        scene.add(nodeGlow);

        // Connection line to center
        var lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(x, y, 0),
        ]);
        var lineMaterial = new THREE.LineBasicMaterial({
          color: nodeColors[i],
          transparent: true,
          opacity: 0.15,
        });
        var line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      });

      // Floating background particles
      var particleCount = 80;
      var particleGeometry = new THREE.BufferGeometry();
      var positions = new Float32Array(particleCount * 3);
      for (var pi = 0; pi < particleCount; pi++) {
        positions[pi * 3] = (Math.random() - 0.5) * 16;
        positions[pi * 3 + 1] = (Math.random() - 0.5) * 12;
        positions[pi * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      var particleMaterial = new THREE.PointsMaterial({
        color: 0x6366f1,
        size: 0.04,
        transparent: true,
        opacity: 0.5,
      });
      var particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // Animation loop
      var clock = new THREE.Clock();
      var animationId;

      function animate() {
        animationId = requestAnimationFrame(animate);
        var elapsed = clock.getElapsedTime();

        // Slowly rotate the entire scene
        scene.rotation.z = Math.sin(elapsed * 0.15) * 0.08;

        // Pulse core
        var pulse = 1 + Math.sin(elapsed * 2) * 0.08;
        coreOrb.scale.set(pulse, pulse, pulse);
        glowOrb.scale.set(pulse * 1.2, pulse * 1.2, pulse * 1.2);

        // Rotate ring
        ring.rotation.z = elapsed * 0.3;
        ring.rotation.x = Math.sin(elapsed * 0.2) * 0.3;

        // Orbit nodes slightly
        nodeMeshes.forEach(function (node, i) {
          var np = nodePositions[i];
          var offset = Math.sin(elapsed * 0.5 + i * 1.2) * 0.15;
          node.position.x = Math.cos(np.angle + elapsed * 0.1) * (radius + offset);
          node.position.y = Math.sin(np.angle + elapsed * 0.1) * (radius + offset);
          node.position.z = Math.sin(elapsed * 0.3 + i) * 0.3;
          var nodePulse = 1 + Math.sin(elapsed * 3 + i * 0.8) * 0.15;
          node.scale.set(nodePulse, nodePulse, nodePulse);
        });

        // Drift particles
        particles.rotation.y = elapsed * 0.02;
        particles.rotation.x = elapsed * 0.01;

        renderer.render(scene, camera);
      }

      animate();

      // Resize handler
      function onResize() {
        width = container.offsetWidth;
        height = container.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }

      window.addEventListener('resize', onResize);

      // Cleanup on page hide
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
          cancelAnimationFrame(animationId);
        } else {
          animate();
        }
      });
    }
