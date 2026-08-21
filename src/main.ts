import './styles/main.css';
const PHI = (1 + Math.sqrt(5)) / 2;
const heroCanvas = document.getElementById('hero-spiral') as HTMLCanvasElement | null;
const heroLatex = document.getElementById('hero-latex');
if (heroLatex && (window as any).katex) {
  (window as any).katex.render('\\displaystyle \\varphi = \\frac{1+\\sqrt5}{2} \\approx 1.618', heroLatex);
}
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d')!;
  let t = 0;
  const dpr = window.devicePixelRatio || 1;
  function resizeHero() {
    if (!heroCanvas) return;
    const rect = heroCanvas.getBoundingClientRect();
    heroCanvas.width = rect.width * dpr;
    heroCanvas.height = rect.height * dpr;
    heroCanvas.style.width = rect.width + 'px';
    heroCanvas.style.height = rect.height + 'px';
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resizeHero);
  resizeHero();
  function drawHero() {
    if (!heroCanvas) return;
    const W = heroCanvas.getBoundingClientRect().width;
    const H = heroCanvas.getBoundingClientRect().height;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    const scale = Math.min(W, H) * 0.035;
    const turns = 6 + Math.sin(t * 0.0003) * 0.5;
    const steps = 900;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const p = i / steps;
      const a = p * turns * Math.PI * 2 + t * 0.001;
      const r = Math.pow(PHI, a / (Math.PI * 0.5)) * 0.12;
      const x = cx + Math.cos(a) * r * scale * 12;
      const y = cy + Math.sin(a) * r * scale * 12;
      const hue = 45 + p * 10;
      ctx.strokeStyle = `hsl(${hue}, 90%, 60%)`;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      ctx.lineWidth = 1.5 + Math.sin(p * 10 - t * 0.002) * 0.7;
      if (i % 20 === 0) { ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); }
    }
    ctx.stroke();
    t += 16;
    requestAnimationFrame(drawHero);
  }
  drawHero();
}
console.log('Aura Lab hero spiral running');
