import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* The whole universe as a 3D point cloud. The camera drifts forward forever;
   scrolling accelerates it — flying through the stars. Mouse tilts the view.
   Stars that pass the camera recycle to the far depth (infinite tunnel). */
export function Starfield3D() {
  const ref = useRef(null)
  useEffect(() => {
    let cleanup
    try { cleanup = init(ref.current) } catch (e) { console.warn('Starfield3D disabled:', e) }
    return () => { try { cleanup && cleanup() } catch { /* noop */ } }
  }, [])
  return <canvas ref={ref} className="shader-field" aria-hidden="true" />
}

function starTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(220,255,252,0.9)')
  grd.addColorStop(0.5, 'rgba(91,233,219,0.35)')
  grd.addColorStop(1, 'rgba(91,233,219,0)')
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c); return t
}

function init(canvas) {
  if (!canvas) return
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6))

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x05080e, 0.00085)   // far stars dissolve into space-black
  const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 4000)

  const COUNT = 4600, SPREAD = 950, DEPTH = 2600
  const pos = new Float32Array(COUNT * 3)
  const col = new Float32Array(COUNT * 3)
  const cWhite = new THREE.Color(0xcfeff0), cCyan = new THREE.Color(0x5be9db)
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() * 2 - 1) * SPREAD
    pos[i * 3 + 1] = (Math.random() * 2 - 1) * SPREAD
    pos[i * 3 + 2] = -Math.random() * DEPTH
    const c = cWhite.clone().lerp(cCyan, Math.random() * 0.9)
    const b = 0.45 + Math.random() * 0.55
    col[i * 3] = c.r * b; col[i * 3 + 1] = c.g * b; col[i * 3 + 2] = c.b * b
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const tex = starTexture()
  const mat = new THREE.PointsMaterial({
    size: 7, map: tex, vertexColors: true, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  })
  const points = new THREE.Points(geo, mat)
  scene.add(points)

  const resize = () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix() }
  resize(); addEventListener('resize', resize)

  const mouse = { x: 0, y: 0 }
  const onMove = (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5 }
  addEventListener('pointermove', onMove)

  const arr = geo.attributes.position.array
  let last = window.scrollY || 0, speed = 0, raf
  const tick = () => {
    const sc = window.scrollY || 0
    speed += (sc - last) * 0.06; last = sc          // scroll → forward boost
    speed *= 0.90                                    // decay
    const drift = (reduce ? 0.25 : 0.9) + Math.min(Math.abs(speed), 60)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 2] += drift
      if (arr[i * 3 + 2] > 40) {                     // passed the camera → recycle to far depth
        arr[i * 3 + 2] = -DEPTH
        arr[i * 3] = (Math.random() * 2 - 1) * SPREAD
        arr[i * 3 + 1] = (Math.random() * 2 - 1) * SPREAD
      }
    }
    geo.attributes.position.needsUpdate = true
    camera.rotation.y += (-mouse.x * 0.25 - camera.rotation.y) * 0.04
    camera.rotation.x += (mouse.y * 0.25 - camera.rotation.x) * 0.04
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('pointermove', onMove)
    geo.dispose(); mat.dispose(); tex.dispose(); renderer.dispose()
  }
}
