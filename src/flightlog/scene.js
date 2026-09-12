/** Original swept-wing sculpture. CPU-projected mesh, no external model or library.
 * Coordinates and angles are illustrative; this is not an aircraft simulation.
 */
const TAU=Math.PI*2;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
function normal(a,b,c){const u=b.map((v,i)=>v-a[i]),v=c.map((q,i)=>q-a[i]);const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const len=Math.hypot(...n)||1;return n.map(v=>v/len);}
function buildAircraft(){
 const faces=[];const face=(a,b,c,d,part=0)=>faces.push({p:[a,b,c,d],n:normal(a,b,c),part});
 // Contoured airfoil skins and undersides. Both sides taper into swept tips.
 for(const side of [-1,1])for(const lower of [false,true]){
  const p=(u,v)=>{const s=u*3.6,chord=2.15-1.56*u;return [side*(.08+s),(.12*Math.sin(Math.PI*v)*(1-.45*u))*(lower?-1:1)+.12*u*u, -.8+u*1.38+(v-.2)*chord];};
  for(let i=0;i<26;i++)for(let j=0;j<12;j++)face(p(i/26,j/12),p((i+1)/26,j/12),p((i+1)/26,(j+1)/12),p(i/26,(j+1)/12),0);
 }
 // Smooth central fuselage with deliberately visible longitudinal topology.
 const body=(u,v)=>{const z=-2.7+u*5.2;const r=.24*Math.pow(Math.sin(u*Math.PI),.85);return [Math.cos(v*TAU)*r,Math.sin(v*TAU)*r+.04,z];};
 for(let i=0;i<36;i++)for(let j=0;j<16;j++)face(body(i/36,j/16),body((i+1)/36,j/16),body((i+1)/36,(j+1)/16),body(i/36,(j+1)/16),1);
 // Tail plane and single fin.
 for(const side of [-1,1]){
  const p=(u,v)=>[side*(.04+1.28*u),.08+.075*Math.sin(Math.PI*v),1.32+u*.44+v*(.95-u*.55)];
  for(let i=0;i<10;i++)for(let j=0;j<5;j++)face(p(i/10,j/5),p((i+1)/10,j/5),p((i+1)/10,(j+1)/5),p(i/10,(j+1)/5),2);
 }
 face([-.05,.05,1.08],[.04,.05,1.08],[.04,1.08,2.06],[-.05,1.08,2.06],2);
 face([-.05,1.08,2.06],[.04,1.08,2.06],[.04,.05,2.45],[-.05,.05,2.45],2);
 // Cockpit canopy is a separate dark, sculptural insert.
 const canopy=(u,v)=>{const s=Math.sin(u*Math.PI);return [Math.cos(v*Math.PI)*.22*s,.2+Math.sin(v*Math.PI)*.24*s,-1.52+u*1.48];};
 for(let i=0;i<12;i++)for(let j=0;j<9;j++)face(canopy(i/12,j/9),canopy((i+1)/12,j/9),canopy((i+1)/12,(j+1)/9),canopy(i/12,(j+1)/9),3);
 return faces;
}
const mesh=buildAircraft();
export function createScene(canvas,{flight=false}={}){
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return null;
 let w=1,h=1,dpr=1,disposed=false,geometryRevision=0;
 let currentX=0,currentY=0,lastTime=0,elapsed=0;
 const resize=()=>{const r=canvas.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);geometryRevision++;};
 const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
 function draw({time=0,pointer=[0,0],motion=true,wire=false,progress=0,bank=0,dark=false}={}){
  if(disposed)return;
  const dt=lastTime?Math.min(.05,(time-lastTime)/1000):.016;lastTime=time;
  if(motion)elapsed+=dt;
  currentX=mix(currentX,pointer[0],motion?.075:1);currentY=mix(currentY,pointer[1],motion?.075:1);
  ctx.clearRect(0,0,w,h);
  const small=w<700;
  const cx=w*(flight?.52:(small?.47:.61)),cy=h*(flight?.53:.47);
  const size=Math.min(w*(flight?.102:.10),h*(flight?.135:.147))*(small?.86:1.0);
  let ax=flight?.78:.55,ay=flight?-.06:-.34,az=flight?-.13:-.60;
  ax+=currentY*.22;ay+=currentX*.32;
  az+=(bank/180*Math.PI)+(motion?Math.sin(elapsed*.34)*.034:0);
  if(flight){ax+=progress*.19;az+=(progress-.5)*.2;}
  const c1=Math.cos(ax),s1=Math.sin(ax),c2=Math.cos(ay),s2=Math.sin(ay),c3=Math.cos(az),s3=Math.sin(az);
  const rotate=p=>{let [x,y,z]=p;let y1=y*c1-z*s1,z1=y*s1+z*c1,x1=x*c2+z1*s2;z1=-x*s2+z1*c2;return [x1*c3-y1*s3,x1*s3+y1*c3,z1];};
  const project=(p)=>{const [x,y,z]=rotate(p);const scale=8.5/(8.5+z);return [cx+x*size*scale,cy+y*size*scale,z];};
  // Background trajectories: a pressure-line field, with a local cursor deflection.
  ctx.lineWidth=.7;
  const xShift=currentX*w*.045;
  for(let j=0;j<36;j++){
   ctx.beginPath();
   for(let i=0;i<=58;i++){
    const x=(i/58)*w*1.2-w*.1;
    const base=(j/35)*h;
    const wave=Math.sin(i*.071+j*.06+elapsed*.08)*h*.052;
    const bulge=Math.exp(-Math.pow((x-cx-xShift)/(w*.27),2)) *Math.sin(j*.21+elapsed*.045)*h*.10;
    const y=base+wave+bulge;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
   }
   ctx.strokeStyle=flight?'rgba(186,202,255,.14)':dark?'rgba(220,226,243,.13)':'rgba(79,81,73,.115)';ctx.stroke();
  }
  // Sparse inset coordinate ruler, avoiding fake live measurements.
  ctx.strokeStyle=flight?'#ffffff35':dark?'#ffffff24':'#151b2328';
  for(let i=1;i<15;i++){let x=w*i/15;ctx.beginPath();ctx.moveTo(x,h*.83);ctx.lineTo(x,h*.83+(i%5===0?11:5));ctx.stroke();}
  // Soft ground shadow is local to the object, not a generic glowing background.
  if(!flight){ctx.save();ctx.translate(cx,cy+h*.2);ctx.scale(1,.24);const g=ctx.createRadialGradient(0,0,0,0,0,size*2.8);g.addColorStop(0,dark?'#0004':'#233c761f');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(-size*3,-size*3,size*6,size*6);ctx.restore();}
  const sorted=mesh.map(f=>{const p=f.p.map(project);const n=rotate(f.n);return {p,n,z:p.reduce((s,p)=>s+p[2],0)/4,part:f.part};}).sort((a,b)=>b.z-a.z);
  const light=[-.3,-.7,-.64];
  for(const f of sorted){
   const diffuse=Math.abs(f.n.reduce((sum,v,i)=>sum+v*light[i],0));
   const reflection=Math.pow(Math.max(0,1-Math.abs(f.n[1]-.28)),8);
   const shade=clamp(.13+.68*diffuse+.58*reflection,0,1);
   const base=flight?[155,175,251]:dark?[117,149,247]:[26,46,202];
   const metal=Math.pow(shade,1.75);
   let r=Math.round(mix(base[0]*.22,245,metal*.82)),g=Math.round(mix(base[1]*.27,247,metal*.84)),b=Math.round(mix(base[2]*.62,255,metal*.86));
   if(f.part===3){r=12+Math.round(reflection*63);g=23+Math.round(reflection*100);b=46+Math.round(reflection*129);}
   ctx.beginPath();f.p.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
   ctx.fillStyle=wire?(flight?'#2447e866':dark?'#17233188':'#d6dfefbb'):`rgb(${r},${g},${b})`;
   ctx.fill();ctx.strokeStyle=wire?(flight?'rgba(235,240,255,.5)':'rgba(29,62,194,.55)'):`rgba(${r},${g},${b},.74)`;ctx.lineWidth=wire?.55:.65;ctx.stroke();
  }
  // A visible wing-tip marker lends a single safety-orange accent.
  for(const side of [-1,1]){const p=project([side*3.68,.12,.83]);ctx.fillStyle='#ff613a';ctx.beginPath();ctx.arc(p[0],p[1],small?2.5:3.5,0,TAU);ctx.fill();}
  canvas.dataset.rendered=String(geometryRevision);
 }
 return {draw,destroy(){disposed=true;ro.disconnect();},resize};
}
