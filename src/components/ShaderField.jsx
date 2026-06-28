import { useEffect, useRef } from 'react'

/* Full-screen, mouse-reactive WebGL field: slow domain-warped noise that drifts
   like signal/ember through the near-black, brightening toward the cursor.
   Raw WebGL (no deps). Fails silent — the ink background shows through. */

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;     // 0..1
uniform float u_react;    // mouse influence 0..1

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  float a=hash(i), b=hash(i+vec2(1.,0.)), c=hash(i+vec2(0.,1.)), d=hash(i+vec2(1.,1.));
  vec2 u=f*f*(3.-2.*f);
  return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v=0., a=0.5;
  for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
  return v;
}
float starLayer(vec2 uv, float scale, float tm){
  vec2 p=uv*scale; vec2 i=floor(p), f=fract(p);
  float h=hash(i);
  float b=smoothstep(0.90,1.0,h);
  vec2 c=vec2(hash(i+7.1), hash(i+13.7));
  float d=length(f-c);
  float tw=0.55+0.45*sin(tm*1.8+h*40.0);
  return b*smoothstep(0.08,0.0,d)*tw;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time * 0.04;
  vec2 mo = (u_mouse - 0.5); mo.y = -mo.y;

  // nebula (domain-warped)
  vec2 q = p*1.3 + mo*0.12;
  vec2 w = vec2(fbm(q + vec2(0.0, t)), fbm(q + vec2(4.0, -t)));
  float neb = smoothstep(0.32, 0.96, fbm(q*1.4 + 2.6*w + t*0.4));

  vec3 deepblue = vec3(0.05, 0.11, 0.22);
  vec3 teal     = vec3(0.03, 0.42, 0.42);
  vec3 tiff     = vec3(0.36, 0.91, 0.86);
  vec3 col = vec3(0.012, 0.022, 0.038);
  col = mix(col, deepblue, neb*0.55);
  col += teal * pow(neb, 1.8) * 0.55;
  col += tiff * pow(neb, 3.0) * 0.28;

  // starfield — two parallax layers
  vec2 su = uv * vec2(u_res.x/u_res.y, 1.0);
  float s = starLayer(su + mo*0.04, 130.0, u_time)
          + starLayer(su + mo*0.10 + 17.0, 74.0, u_time) * 0.8;
  col += vec3(0.82, 0.95, 1.0) * s;

  // cursor glow
  vec2 m = u_mouse; m.y = 1.0 - m.y;
  float glow = smoothstep(0.5, 0.0, distance(uv, m)) * (0.4 + 0.7*u_react);
  col += tiff * glow * 0.38;

  col *= 1.0 - 0.45*pow(length(p*vec2(0.72,1.0)), 2.3);
  gl_FragColor = vec4(col, 1.0);
}
`
const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a,0.,1.); }`

function compile(gl, type, src) {
  const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null }
  return s
}

export function ShaderField() {
  const ref = useRef(null)
  useEffect(() => {
    let cleanup
    try { cleanup = init(ref.current) } catch (e) { console.warn('ShaderField disabled:', e) }
    return () => { try { cleanup && cleanup() } catch { /* noop */ } }
  }, [])
  return <canvas ref={ref} className="shader-field" aria-hidden="true" />
}

function init(cv) {
    if (!cv) return
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const a = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uMouse = gl.getUniformLocation(prog, 'u_mouse')
    const uReact = gl.getUniformLocation(prog, 'u_react')

    const DPR = Math.min(devicePixelRatio || 1, 1.6)
    const resize = () => {
      cv.width = Math.floor(innerWidth * DPR); cv.height = Math.floor(innerHeight * DPR)
      gl.viewport(0, 0, cv.width, cv.height)
    }
    resize(); addEventListener('resize', resize)

    const mouse = { x: 0.5, y: 0.5, react: 0 }
    const onMove = (e) => { mouse.x = e.clientX / innerWidth; mouse.y = e.clientY / innerHeight; mouse.react = 1 }
    addEventListener('pointermove', onMove)

    let raf, start
    const frame = (now) => {
      if (!start) start = now
      const t = (now - start) / 1000
      mouse.react *= 0.96
      gl.uniform2f(uRes, cv.width, cv.height)
      gl.uniform1f(uTime, reduce ? 8.0 : t)
      gl.uniform2f(uMouse, mouse.x, mouse.y)
      gl.uniform1f(uReact, mouse.react)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduce) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', onMove) }
}
