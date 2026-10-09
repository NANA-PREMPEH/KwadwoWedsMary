import confetti from 'canvas-confetti';

// Elegant celebration confetti with Burnt Orange, Emerald Green, and Champagne Gold foil
export function launchWeddingConfetti() {
  const weddingColors = ['#C85A17', '#E06D28', '#0F5132', '#1B4D3E', '#DFBA73', '#FFFFFF'];

  // 1. Initial High-Velocity Center Burst
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors: weddingColors,
    ticks: 350,
    gravity: 0.8,
    scalar: 1.2,
    shapes: ['circle', 'square']
  });

  // 2. Left side celebratory cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0.05, y: 0.75 },
      colors: weddingColors,
      ticks: 300,
      gravity: 0.9,
      scalar: 1.1
    });
  }, 180);

  // 3. Right side celebratory cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 0.95, y: 0.75 },
      colors: weddingColors,
      ticks: 300,
      gravity: 0.9,
      scalar: 1.1
    });
  }, 360);

  // 4. Stars and romantic heart flutter finale
  setTimeout(() => {
    confetti({
      particleCount: 45,
      spread: 120,
      origin: { y: 0.4 },
      colors: ['#DFBA73', '#C85A17', '#0F5132', '#FFFFFF'],
      ticks: 400,
      shapes: ['star', 'circle'],
      scalar: 1.3
    });
  }, 600);

  // 5. Ambient Falling Petals Canvas Overlay
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    rotation: number;
    vRot: number;
    shape: 'petal' | 'strip' | 'circle';
    alpha: number;
  }

  const particles: Particle[] = [];
  const particleCount = 70;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * (0.2 + Math.random() * 0.6),
      y: height * 0.4,
      size: 6 + Math.random() * 8,
      color: weddingColors[Math.floor(Math.random() * weddingColors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: -10 - Math.random() * 8,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 6,
      shape: Math.random() > 0.5 ? 'petal' : Math.random() > 0.5 ? 'strip' : 'circle',
      alpha: 1,
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();
  const duration = 4000; // ms

  function animate() {
    const elapsed = Date.now() - startTime;
    if (elapsed > duration) {
      if (canvas.parentNode) {
        document.body.removeChild(canvas);
      }
      return;
    }

    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.985; // drag
      p.rotation += p.vRot;

      if (elapsed > duration - 1200) {
        p.alpha = Math.max(0, (duration - elapsed) / 1200);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'petal') {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.8, p.size * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'strip') {
        ctx.fillRect(-p.size / 2, -p.size * 1.5, p.size, p.size * 3);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animationFrameId = requestAnimationFrame(animate);
}

