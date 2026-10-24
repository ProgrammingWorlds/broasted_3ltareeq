/* ===================== بروستد ع الطريق — script.js ===================== */
document.addEventListener('DOMContentLoaded', () => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pre = $('.preloader');

  /* ---------- عام ---------- */
  $('#year').textContent = new Date().getFullYear();
  $('.hero-media video')?.play().catch(() => {});

  /* ---------- Navbar ---------- */
  const nav = $('#navbar');
  const burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav-links a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('nav-open'))
  );

  /* ---------- تبويبات المنيو ---------- */
  const grid = $('#menuGrid');
  const tabBtns = $$('.tab-btn');
  tabBtns.forEach(btn => btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) return;
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    grid.dataset.active = btn.dataset.filter;
    if (window.gsap) {
      const visible = $$('.menu-item', grid).filter(i => i.offsetParent !== null);
      gsap.fromTo(visible,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: .5, stagger: .05, ease: 'power3.out', overwrite: true }
      );
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
  }));

  /* ---------- معرض الصور (Lightbox) ---------- */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  const gImgs = $$('.g-item img');
  let gIdx = 0;
  const openLb = i => {
    gIdx = (i + gImgs.length) % gImgs.length;
    lbImg.src = gImgs[gIdx].src;
    lbImg.alt = gImgs[gIdx].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.gsap) gsap.fromTo(lbImg, { scale: .85, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: 'power3.out' });
  };
  const closeLb = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
  $$('.g-item').forEach((fig, i) => fig.addEventListener('click', () => openLb(i)));
  $('.lb-close').addEventListener('click', closeLb);
  $('.lb-prev').addEventListener('click', e => { e.stopPropagation(); openLb(gIdx - 1); });
  $('.lb-next').addEventListener('click', e => { e.stopPropagation(); openLb(gIdx + 1); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

  /* ---------- الفيديوهات ---------- */
  const vm = $('#videoModal');
  const mv = $('#modalVideo');
  $$('.video-card').forEach(card => {
    const vid = $('video', card);
    card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
    card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    card.addEventListener('click', () => {
      mv.src = card.dataset.video;
      vm.classList.add('open');
      document.body.style.overflow = 'hidden';
      mv.play().catch(() => {});
    });
  });
  const closeVm = () => { vm.classList.remove('open'); mv.pause(); mv.removeAttribute('src'); document.body.style.overflow = ''; };
  $('.vm-close').addEventListener('click', closeVm);
  vm.addEventListener('click', e => { if (e.target === vm) closeVm(); });

  document.addEventListener('keydown', e => {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft')  openLb(gIdx + 1);
      if (e.key === 'ArrowRight') openLb(gIdx - 1);
    }
    if (e.key === 'Escape' && vm.classList.contains('open')) closeVm();
  });

  /* =====================================================
     GSAP — الحركات كلها (لو ما اشتغل الـ CDN الموقع يظل شغال)
  ====================================================== */
  if (!window.gsap) { pre?.remove(); return; }
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  if (reduced) { pre?.remove(); return; }

  /* ---------- Preloader ---------- */
  const preBar = $('.pre-bar span');
  const preNum = $('.pre-count');
  const cnt = { v: 0 };
  const tl = gsap.timeline({ onComplete: () => pre && pre.remove() });
  tl.to(cnt, {
      v: 100, duration: 1.5, ease: 'power2.inOut',
      onUpdate: () => { preNum.textContent = Math.round(cnt.v) + '%'; preBar.style.width = cnt.v + '%'; }
    })
    .to('.pre-inner', { yPercent: -40, opacity: 0, duration: .45, ease: 'power2.in' }, '+=.1')
    .to(pre, { yPercent: -100, duration: .8, ease: 'power4.inOut' })
    .add(heroIntro(), '-=.45');

  function heroIntro() {
    gsap.set('.hero-word', { transformPerspective: 750 });
    const t = gsap.timeline();
    t.from('.hero-word',  { rotateX: -95, y: 90, opacity: 0, transformOrigin: '50% 100%', duration: 1.05, stagger: .16, ease: 'power4.out' })
     .from('.hero-kicker',{ y: 24, opacity: 0, duration: .6 }, .15)
     .from('.hero-tag .w',{ y: 26, opacity: 0, duration: .55, stagger: .05 }, '-=.7')
     .from('.hero-cta .btn', { y: 28, opacity: 0, duration: .55, stagger: .1 }, '-=.45')
     .from('.hero-mini div',{ y: 24, opacity: 0, duration: .5, stagger: .08 }, '-=.4')
     .from('.hero-float',   { scale: .5, opacity: 0, duration: .8, stagger: .15, ease: 'back.out(1.7)' }, '-=.6')
     .from('.scroll-cue',   { opacity: 0, y: 20, duration: .5 }, '-=.4')
     .from('.navbar',       { y: -90, opacity: 0, duration: .7, ease: 'power3.out' }, '-=.8');
    return t;
  }

  /* ---------- عوامة بطاقات ذهبية ---------- */
  $$('[data-float]').forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? 16 : -16, duration: 2.4 + i * .5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.4 });
  });

  /* ---------- ScrollTrigger: ظهور + بارالاكس + عدادات ---------- */
  if (window.ScrollTrigger) {
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      gsap.from(el, { y: 70, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    gsap.utils.toArray('[data-reveal-group]').forEach(g => {
      gsap.from(g.children, { y: 60, opacity: 0, duration: .8, stagger: .09, ease: 'power3.out',
        scrollTrigger: { trigger: g, start: 'top 85%', once: true } });
    });

    // خروج الـ Hero بالسكرول
    gsap.to('.hero-media', { yPercent: 14, scale: 1.1, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-content', { yPercent: -10, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '70% top', scrub: true } });

    // بارالاكس الصور
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      const s = parseFloat(el.dataset.parallax) || 10;
      gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // عدادات الأرقام
    $$('[data-count]').forEach(el => {
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.dec || 0);
      const o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true,
        onEnter: () => gsap.to(o, { v: end, duration: 2, ease: 'power3.out',
          onUpdate: () => el.textContent = o.v.toFixed(dec) }) });
    });

    // Navbar: خلفية + إخفاء عند النزول + زر الاتصال العائم
    const fab = $('#fab');
    let lastY = 0;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate(self) {
      const y = self.scroll();
      nav.classList.toggle('scrolled', y > 40);
      fab.classList.toggle('show', y > innerHeight * .7);
      if (y > 600 && y > lastY + 6) nav.classList.add('nav-hidden');
      else if (y < lastY - 6) nav.classList.remove('nav-hidden');
      lastY = y;
    }});

    // تمييز الرابط النشط
    $$('section[id]').forEach(sec => {
      ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%',
        onToggle: st => { if (st.isActive) $$('.nav-links a').forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id)); } });
    });
  }

  /* ---------- بارالاكس بالماوس على الـ Hero ---------- */
  if (matchMedia('(pointer:fine)').matches) {
    $('.hero').addEventListener('pointermove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      gsap.to('.hero-media video', { x: x * -24, y: y * -16, duration: .9, ease: 'power2.out' });
      gsap.to('.hero-content',     { x: x * 14, duration: .9, ease: 'power2.out' });
      gsap.to('.hero-float.f1 .hf-in', { x: x * 30,  y: y * 24,  duration: 1, ease: 'power2.out' });
      gsap.to('.hero-float.f2 .hf-in', { x: x * -26, y: y * -20, duration: 1, ease: 'power2.out' });
    });

    /* ---------- 3D Tilt ---------- */
    $$('[data-tilt]').forEach(card => {
      gsap.set(card, { transformPerspective: 800 });
      const rx = gsap.quickTo(card, 'rotationX', { duration: .45, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: .45, ease: 'power3.out' });
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 12);
        rx(-((e.clientY - r.top) / r.height - .5) * 10);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });

    /* ---------- مؤشر مخصص ---------- */
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickTo(dot, 'x', { duration: .12, ease: 'power2.out' });
    const dy = gsap.quickTo(dot, 'y', { duration: .12, ease: 'power2.out' });
    const rX = gsap.quickTo(ring, 'x', { duration: .45, ease: 'power3.out' });
    const rY = gsap.quickTo(ring, 'y', { duration: .45, ease: 'power3.out' });
    window.addEventListener('pointermove', e => {
      dx(e.clientX); dy(e.clientY); rX(e.clientX); rY(e.clientY);
    });
    $$('a, button, .g-item, .menu-item, .video-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
  }
});