/** Original low-wing touring aircraft; GPU-resident geometry, not a flight simulator. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
const clamp=THREE.MathUtils.clamp;
const smooth=(a,b,t)=>a+(b-a)*t;
function surface(fn,nu,nv,flip=false){
 const positions=[],uvs=[],indices=[];
 for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){positions.push(...fn(i/nu,j/nv));uvs.push(i/nu,j/nv);}
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*(nv+1)+j,b=a+nv+1;indices.push(...(flip?[a,a+1,b,b,a+1,b+1]:[a,b,a+1,b,b+1,a+1]));}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;
}
function createAircraft(){
 const root=new THREE.Group(),parts=[],geometries=new Set(),materials=new Set();
 const paint=new THREE.MeshStandardMaterial({color:0xf1eee3,metalness:.22,roughness:.3,side:THREE.DoubleSide});
 const navy=new THREE.MeshStandardMaterial({color:0x123258,metalness:.35,roughness:.29,side:THREE.DoubleSide});
 const metal=new THREE.MeshStandardMaterial({color:0xc9d2da,metalness:.83,roughness:.24});
 const rubber=new THREE.MeshStandardMaterial({color:0x171e25,roughness:.64});
 const glass=new THREE.MeshStandardMaterial({color:0x163b4b,metalness:.64,roughness:.12,side:THREE.DoubleSide});
 const copper=new THREE.MeshStandardMaterial({color:0xd98552,metalness:.65,roughness:.3});
 const seamMat=new THREE.LineBasicMaterial({color:0x233d57,transparent:true,opacity:.30});
 const add=(geo,mat,parent=root)=>{const m=new THREE.Mesh(geo,mat);geometries.add(geo);materials.add(mat);parent.add(m);parts.push(m);return m;};
 const ellipsoid=(x,y,z,rx,ry,rz,mat,parent=root)=>{const m=add(new THREE.SphereGeometry(1,28,18),mat,parent);m.position.set(x,y,z);m.scale.set(rx,ry,rz);return m;};
 const tube=(points,r=.015,mat=paint)=>{const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return add(new THREE.TubeGeometry(curve,Math.max(10,points.length*3),r,5,false),mat);};
 const bodyPoints=[[-2.98,.20,.25,-.02],[-2.76,.40,.38,0],[-2.1,.49,.47,0],[-1.25,.55,.49,.01],[-.1,.55,.48,.02],[.68,.44,.42,.045],[1.6,.27,.30,.10],[2.5,.12,.205,.17],[3.15,.015,.09,.20]];
 const bodyCurve=new THREE.CatmullRomCurve3(bodyPoints.map(p=>new THREE.Vector3(p[0],p[1],p[2])),false,'catmullrom',.20);
 const body=(u,v)=>{const c=bodyCurve.getPoint(u),z=c.x,centerY=.03+Math.max(0,z)*.05;return [c.y*Math.cos(v*Math.PI*2),centerY+c.z*Math.sin(v*Math.PI*2),z];};
 add(surface(body,76,48),paint);
 for(const side of [-1,1]){
  const angle=side===1?0:Math.PI;
  const stripe=(u,v)=>{const c=bodyCurve.getPoint(.13+u*.81);const a=angle+(v-.5)*.19;return [c.y*1.004*Math.cos(a),.03+Math.max(0,c.x)*.05+c.z*1.004*Math.sin(a),c.x];};
  add(surface(stripe,40,3),navy);
 }
 const wing=(side,tail=false)=>{
  const span=tail?1.83:4.92,start=tail?.10:.35;
  const fn=(u,v,lower)=>{
   const x=start+u*(span-start),c=tail?(.95-.40*u):(1.78-.60*Math.pow(u,1.5));
   const leading=tail?(2.04+.34*u):(-.76+.18*u);
   const thickness=5*(tail?.075:.115)*c*(.2969*Math.sqrt(v)-.1260*v-.3516*v*v+.2843*v*v*v-.1036*v*v*v*v);
   const camber=.018*c*Math.sin(Math.PI*v);
   return [side*x,(tail?.28:-.30)+u*(tail?.025:.35)+camber+(lower?-thickness:thickness),leading+v*c];
  };
  for(const lower of [false,true]){
   const g=surface((u,v)=>fn(u,v,lower),26,28,(side>0)!==lower);
   const colors=[];const white=new THREE.Color(0xf1eee3),blue=new THREE.Color(0x123258),accent=new THREE.Color(0xd98552);
   for(let i=0;i<=26;i++)for(let j=0;j<=28;j++){const u=i/26;const col=u>.945?blue:(!tail&&u>.875&&u<.900?accent:white);colors.push(col.r,col.g,col.b);}
   g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
   const mat=paint.clone();mat.color.set(0xffffff);mat.vertexColors=true;add(g,mat);
  }
  const pts=[];for(let i=0;i<=26;i++){const p=fn(.24+i/26*.73,.77,false);p[1]+=.008;pts.push(new THREE.Vector3(...p));}
  const g=new THREE.BufferGeometry().setFromPoints(pts);geometries.add(g);materials.add(seamMat);root.add(new THREE.Line(g,seamMat));
 };
 for(const side of [-1,1]){wing(side);wing(side,true);}
 const finShape=new THREE.Shape();finShape.moveTo(1.78,.24);finShape.lineTo(2.60,1.60);finShape.quadraticCurveTo(2.67,1.70,2.83,1.69);finShape.lineTo(3.14,1.67);finShape.lineTo(3.32,.23);finShape.closePath();
 const fg=new THREE.ExtrudeGeometry(finShape,{depth:.075,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:12});
 fg.rotateY(-Math.PI/2);fg.translate(.038,0,0);add(fg,paint);
 tube([[.015,1.57,2.66],[.015,1.64,2.84],[.015,1.62,3.11]],.042,navy);
 const canopy=(u,v)=>{const bell=Math.pow(Math.sin(Math.PI*u),.48),z=-1.85+u*2.25,theta=v*Math.PI;return [.53*bell*Math.cos(theta),.36+.60*bell*Math.sin(theta),z];};
 add(surface(canopy,34,28),glass);
 for(const u of [.035,.45,.96]){const p=[];for(let j=0;j<=18;j++){const a=canopy(u,j/18);a[1]+=.01;p.push(a);}tube(p,.024,paint);}
 const roof=[];for(let i=1;i<34;i++){const p=canopy(i/34,.5);p[1]+=.015;roof.push(p);}tube(roof,.035,paint);
 for(const v of [.01,.99]){const p=[];for(let i=1;i<34;i++)p.push(canopy(i/34,v));tube(p,.020,paint);}
 const prop=new THREE.Group();prop.position.set(0,0,-3.01);root.add(prop);
 ellipsoid(0,0,-.14,.225,.225,.32,metal,prop);
 for(const sign of [-1,1]){const blade=ellipsoid(.02,sign*.64,.005,.12,.58,.035,navy,prop);blade.rotation.z=-.13;ellipsoid(-sign*.11,sign*1.10,.002,.07,.12,.037,copper,prop);}
 const disc=add(new THREE.CircleGeometry(1.21,48),new THREE.MeshBasicMaterial({color:0xc8d5dc,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}),prop);disc.position.z=.045;
 for(const [x,z] of [[-1.20,.10],[1.20,.10],[0,-2.10]]){
  tube([[x*.77,-.30,z-.05],[x,-.92,z+.12]],.032,metal);
  ellipsoid(x,-.99,z+.15,.12,.17,.37,paint);
  const wheel=add(new THREE.CylinderGeometry(.15,.15,.11,20),rubber);wheel.rotation.z=Math.PI/2;wheel.position.set(x,-1.06,z+.14);
 }
 ellipsoid(-.23,-.13,-2.88,.10,.064,.06,rubber);ellipsoid(.23,-.13,-2.88,.10,.064,.06,rubber);
 for(const side of [-1,1])ellipsoid(side*4.9,.09,-.20,.07,.036,.09,copper);
 const wireMaterial=new THREE.MeshBasicMaterial({color:0x5376b5,wireframe:true,transparent:true,opacity:.32});materials.add(wireMaterial);
 let wireState=false;
 return {root,prop,disc,setWire(wire){if(wireState===wire)return;wireState=wire;parts.forEach(m=>{if(m===disc)return;if(wire){m.userData.surface=m.material;m.material=wireMaterial;}else if(m.userData.surface)m.material=m.userData.surface;});},dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}
const fallbackSVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480"><defs><linearGradient id="p"><stop stop-color="#f3f0e7"/><stop offset="1" stop-color="#b3c2d0"/></linearGradient></defs><g transform="translate(405 250) rotate(-24)"><ellipse rx="229" ry="93" cy="35" fill="#152f5910"/><path d="M-233 13-224-9-30-34-21-139Q0-165 21-139L30-34 224-9 233 13 29 10 17 99 91 121 90 135 13 123Q0 145-13 123L-90 135-91 121-17 99-29 10Z" fill="url(#p)" stroke="#214967" stroke-width="2"/><path d="M-22-47Q0-83 22-47L18 14Q0 27-18 14Z" fill="#17364b"/><path d="M-226-7-206-5-207 16-230 14M226-7 206-5 207 16 230 14" fill="#163354"/><path d="M-56-144h112" stroke="#163354" stroke-width="9" stroke-linecap="round"/></g></svg>';
export function createScene(canvas,{flight=false}={}){
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});}catch{
  const img=document.createElement('img');img.src='data:image/svg+xml,'+encodeURIComponent(fallbackSVG);img.className='aircraft-fallback';img.alt='';img.setAttribute('aria-hidden','true');canvas.after(img);canvas.dataset.renderer='static-fallback';canvas.dataset.rendered='1';
  return {draw(){},resize(){},destroy(){img.remove();},getStats(){return{renderer:'static-fallback'};}};
 }
 renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(31,1,.1,100);
 const model=createAircraft();scene.add(model.root);
 const hemi=new THREE.HemisphereLight(0xf4f7ff,0x4e6176,2.15);scene.add(hemi);
 const key=new THREE.DirectionalLight(0xfff6df,3.4);key.position.set(-4,8,-6);scene.add(key);
 const fill=new THREE.DirectionalLight(0x9bbdff,2.0);fill.position.set(6,3,3);scene.add(fill);
 const rim=new THREE.DirectionalLight(0xffffff,1.7);rim.position.set(-4,1,6);scene.add(rim);
 let environment,pmrem;
 try{pmrem=new THREE.PMREMGenerator(renderer);const room=new RoomEnvironment();environment=pmrem.fromScene(room,.045);scene.environment=environment.texture;scene.environmentIntensity=.65;room.dispose();pmrem.dispose();pmrem=null;}catch{}
 let w=1,h=1,disposed=false,lost=false,lastTime=0,x=0,y=0,bankNow=0,progressNow=0,clock=0,dpr=1,qualityChanged=false,slowFrames=0,lastWire=false;
 const resize=()=>{if(disposed||lost)return;const r=canvas.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,qualityChanged?1:(innerWidth<650?1.35:1.6));renderer.setPixelRatio(dpr);renderer.setSize(w,h,false);camera.aspect=w/h;
  const aspect=w/h;const distance=aspect<1.2?20.4:17.5;camera.position.set(distance*.55,distance*.44,-distance*.76);camera.lookAt(0,-.02,0);camera.updateProjectionMatrix();canvas.dataset.renderer='webgl2';canvas.dataset.rendered='1';};
 const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
 const lostHandler=e=>{e.preventDefault();lost=true;canvas.dataset.renderer='context-lost';};
 const restoreHandler=()=>{lost=false;resize();};canvas.addEventListener('webglcontextlost',lostHandler);canvas.addEventListener('webglcontextrestored',restoreHandler);
 function draw({time=0,pointer=[0,0],motion=true,wire=false,progress=0,bank=0,dark=false,departure=0}={}){
  if(disposed||lost)return;const dt=lastTime?clamp((time-lastTime)/1000,.001,.06):1/60;lastTime=time;
  if(motion)clock+=dt;
  const rate=motion?1-Math.exp(-7.5*dt):1;
  x=smooth(x,pointer[0],rate);y=smooth(y,pointer[1],rate);bankNow=smooth(bankNow,bank,rate);progressNow=smooth(progressNow,progress,rate);
  const tour=flight?progressNow:0;
  model.root.rotation.set((flight?.02:-.025)+y*.10,(flight?-.12+tour*.37:-.11)+x*.27,(flight?-.03:.035)-bankNow*Math.PI/180*.62);
  model.root.position.set(flight?Math.sin(tour*Math.PI)*.28:departure*.35,(motion?Math.sin(clock*.63)*.034:0)+(flight?Math.sin(tour*Math.PI)*.10:departure*.18),0);
  const scale=flight?1.02+Math.sin(tour*Math.PI)*.035:1.06;model.root.scale.setScalar(scale);
  model.prop.rotation.z=motion?clock*(flight?11.2:1.1):.30;model.disc.material.opacity=motion&&flight?.055:0;
  if(lastWire!==wire){model.setWire(wire);lastWire=wire;}
  renderer.toneMappingExposure=flight?1.20:dark?1.15:1.08;
  const start=performance.now();renderer.render(scene,camera);const cost=performance.now()-start;
  if(cost>19)slowFrames++;else slowFrames=Math.max(0,slowFrames-1);
  if(slowFrames>80&&!qualityChanged){qualityChanged=true;resize();}
 }
 return {draw,resize,getStats:()=>({renderer:'webgl2',calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,pixelRatio:dpr}),destroy(){disposed=true;ro.disconnect();canvas.removeEventListener('webglcontextlost',lostHandler);canvas.removeEventListener('webglcontextrestored',restoreHandler);model.dispose();environment?.dispose();renderer.dispose();renderer.forceContextLoss();}};
}
