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
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time * 0.045;

  // domain warp
  vec2 q = vec2(fbm(p*1.6 + vec2(0.0, t)), fbm(p*1.6 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p*1.6 + 3.0*q + vec2(1.7, 9.2) + t*0.5),
                fbm(p*1.6 + 3.0*q + vec2(8.3, 2.8) - t*0.5));
  float f = fbm(p*1.8 + 3.5*r);

  // mouse glow
  vec2 m = u_mouse; m.y = 1.0 - m.y;
  float md = distance(uv, m);
  float glow = smoothstep(0.42, 0.0, md) * (0.35 + 0.65*u_react);

  vec3 ink   = vec3(0.039, 0.043, 0.055);
  vec3 deep  = vec3(0.071, 0.078, 0.094);
  vec3 amber = vec3(0.941, 0.663, 0.235);

  float bands = smoothstep(0.45, 0.95, f);
  vec3 col = mix(ink, deep, smoothstep(0.2, 0.8, f));
  col += amber * pow(bands, 2.4) * 0.16;          // faint ember filaments
  col += amber * glow * (0.10 + 0.18*pow(bands,2.0)); // cursor brightening
  // vignette
  col *= 1.0 - 0.5*pow(length(p*vec2(0.7,1.0)), 2.2);
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
