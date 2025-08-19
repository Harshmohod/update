/* Minimal, high-quality interactions and a lightweight particle system */
(function(){
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll for in-page anchors
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if(!anchor) return;
    const id = anchor.getAttribute('href');
    if(!id || id === '#') return;
    const target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.pageYOffset - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });

  // Particles background
  const canvas = document.getElementById('particles-canvas');
  if(!canvas || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    init();
  });

  const particles = [];
  const NUM = Math.min(160, Math.floor((width * height) / 12000));

  function random(min, max){ return Math.random() * (max - min) + min; }

  function init(){
    particles.length = 0;
    for(let i=0;i<NUM;i++){
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: random(-0.4, 0.4),
        vy: random(-0.3, 0.3),
        r: random(0.6, 2.0),
        hue: 190 + Math.random() * 80
      });
    }
  }

  function step(){
    ctx.clearRect(0,0,width,height);
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -10) p.x = width + 10; if(p.x > width + 10) p.x = -10;
      if(p.y < -10) p.y = height + 10; if(p.y > height + 10) p.y = -10;
    }

    // Draw connections
    for(let i=0;i<particles.length;i++){
      const a = particles[i];
      for(let j=i+1;j<particles.length;j++){
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx*dx + dy*dy;
        if(d2 < 140*140){
          const alpha = 1 - d2 / (140*140);
          ctx.strokeStyle = `hsla(${(a.hue+b.hue)/2}, 100%, 70%, ${alpha*0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for(const p of particles){
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, 0.8)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  init();
  requestAnimationFrame(step);
})();


