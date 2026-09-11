/** A dependency-free, depth-sorted particle observatory. Decorative, not measured data.
 * One RAF, clamped DPR, offscreen/hidden pause and explicit teardown.
 */
export function mountOrbit(canvas, animate = true) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return () => {};
  let w = 1, h = 1, frame = 0, visible = true, disposed = false, time = 0, last = 0;
  let pointer = [0, 0], current = [0, 0];
  const points = [], stars = [];
  let seed = 2611;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 1700; i++) {
    const a = random() * Math.PI * 2, b = random() * Math.PI * 2;
    const r = .82 + .24 * Math.cos(b);
    points.push([r * Math.cos(a), .24 * Math.sin(b), r * Math.sin(a), random()]);
  }
  for (let i = 0; i < 65; i++) stars.push([random(), random(), random()]);
  const project = (x, y, z, a, tilt) => {
    let xx = x * Math.cos(a) + z * Math.sin(a), zz = -x * Math.sin(a) + z * Math.cos(a);
    const yy = y * Math.cos(tilt) - zz * Math.sin(tilt);
    zz = y * Math.sin(tilt) + zz * Math.cos(tilt);
    const perspective = 3.7 / (3.7 + zz);
    const scale = Math.min(w * .36, h * .43);
    return [w * .5 + xx * scale * perspective, h * .5 + yy * scale * perspective, zz, perspective];
  };
  function draw() {
    if (disposed) return;
    ctx.clearRect(0, 0, w, h);
    current[0] += (pointer[0] - current[0]) * .045;
    current[1] += (pointer[1] - current[1]) * .045;
    const a = time * .065 + current[0] * .22, tilt = .6 + current[1] * .15;
    for (const [x, y, s] of stars) {
      ctx.fillStyle = `rgba(172,196,207,${.15 + s * .28})`;
      ctx.fillRect(x * w, y * h, s > .9 ? 1.5 : .8, s > .9 ? 1.5 : .8);
    }
    const halo = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w,h)*.52);
    halo.addColorStop(0, 'rgba(83,182,171,.09)'); halo.addColorStop(.56, 'rgba(80,146,170,.025)'); halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle=halo;ctx.fillRect(0,0,w,h);
    for (let ring=0;ring<3;ring++) {
      ctx.beginPath();
      for(let i=0;i<=160;i++) {
        const k=i/160*Math.PI*2, r=1.36+ring*.12;
        const p=project(r*Math.cos(k),Math.sin(k)*(.15+ring*.1),r*Math.sin(k),a*.2+ring*.4,tilt+.17*ring);
        i ? ctx.lineTo(p[0],p[1]) : ctx.moveTo(p[0],p[1]);
      }
      ctx.strokeStyle = ring===1?'rgba(230,184,129,.34)':'rgba(112,189,200,.17)';ctx.lineWidth=.7;ctx.stroke();
    }
    const projected=points.map(([x,y,z,s])=>[...project(x,y,z,a,tilt),s]);
    projected.sort((x,y)=>y[2]-x[2]);
    for(const [x,y,z,p,s] of projected) {
      const depth=(1.2-z)/2.4;
      ctx.fillStyle=s>.84?`rgba(247,193,130,${.3+depth*.6})`:`rgba(133,213,220,${.14+depth*.66})`;
      const r=(s>.97?1.7:.55+s*.48)*p;
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
    for(let i=0;i<4;i++) {
      const k=time*(.12+i*.025)+i*1.57;
      const p=project(1.49*Math.cos(k),Math.sin(k)*.25,1.49*Math.sin(k),a*.2+.4,tilt+.17);
      const g=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],13);
      g.addColorStop(0,'rgba(245,191,128,.65)');g.addColorStop(1,'rgba(245,191,128,0)');ctx.fillStyle=g;ctx.fillRect(p[0]-13,p[1]-13,26,26);
      ctx.fillStyle='#f3ce9f';ctx.beginPath();ctx.arc(p[0],p[1],2,0,Math.PI*2);ctx.fill();
    }
  }
  function tick(now) {
    frame=0;if(disposed || !animate || !visible || document.hidden) return;
    if(last) time += Math.min((now-last)/1000,.04);last=now;draw();frame=requestAnimationFrame(tick);
  }
  function sync() { cancelAnimationFrame(frame);frame=0;last=0;if(animate&&visible&&!document.hidden&&!disposed) frame=requestAnimationFrame(tick);else draw(); }
  const resize=()=> {const r=canvas.getBoundingClientRect();w=Math.max(r.width,1);h=Math.max(r.height,1);const dpr=Math.min(devicePixelRatio||1,1.75);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();};
  const move=e=>{if(!animate)return;const r=canvas.getBoundingClientRect();pointer=[(e.clientX-r.left)/w-.5,(e.clientY-r.top)/h-.5];};
  const leave=()=>{pointer=[0,0];};
  const ro=new ResizeObserver(resize);ro.observe(canvas);
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});io.observe(canvas);
  canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',sync);
  resize();sync();
  return ()=>{disposed=true;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',sync);};
}
