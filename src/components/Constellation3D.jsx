import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const pick = (v, lang) => (typeof v === 'string' ? v : (v[lang] ?? v.en))

const NODES = [
  { id: 'core', pos: [0, 0, 0], r: 9, label: { en: 'Rongze', zh: '荣泽' }, blurb: { en: 'Where the fields connect — one operator across all of them.', zh: '各领域在此交汇 —— 一个人贯穿全部。' } },
  { id: 'ai', pos: [-58, 36, 22], r: 6.5, label: { en: 'AI · Agents', zh: 'AI · 智能体' }, blurb: { en: 'Persistent, memory-driven agent systems that stay alive.', zh: '有记忆、能长期运行的"活着"的智能体系统。' } },
  { id: 'quant', pos: [62, 30, -16], r: 6.5, label: { en: 'Quant · Finance', zh: '量化 · 金融' }, blurb: { en: 'Signal research, modeling, financial AI. CQF, WorldQuant.', zh: '信号研究、建模、金融 AI。CQF、WorldQuant。' } },
  { id: 'systems', pos: [44, -46, 30], r: 6, label: { en: 'Systems · Code', zh: '系统 · 编程' }, blurb: { en: 'Runtimes, performance, cross-language low-level craft.', zh: '运行时、性能、跨语言的底层工程。' } },
  { id: 'medical', pos: [-36, -52, -22], r: 6, label: { en: 'Healthcare', zh: '医疗 · 健康' }, blurb: { en: 'Human-facing AI in high-stakes clinical contexts.', zh: '高风险医疗场景里直接面向人的 AI。' } },
  { id: 'gaming', pos: [72, -8, 26], r: 5.5, label: { en: 'Gaming', zh: '游戏' }, blurb: { en: 'Systems thinking as play — balance and interaction.', zh: '把系统思维当游乐场 —— 平衡与交互。' } },
  { id: 'embodied', pos: [-66, -6, -26], r: 6, label: { en: 'Robotics', zh: '机器人 · 具身' }, blurb: { en: 'Perception, deployment, intelligence in the physical world.', zh: '感知、部署、走进物理世界的智能。' } },
  { id: 'flight', pos: [8, 64, -12], r: 5.5, label: { en: 'Flight · FPV', zh: '飞行 · 穿越机' }, blurb: { en: 'Control, procedure, spatial judgement, precision.', zh: '控制、流程、空间判断、精度。' } },
]
const EDGES = [
  ['core', 'ai'], ['core', 'quant'], ['core', 'systems'], ['core', 'medical'], ['core', 'gaming'], ['core', 'embodied'], ['core', 'flight'],
  ['ai', 'quant'], ['ai', 'systems'], ['ai', 'medical'], ['quant', 'systems'], ['embodied', 'flight'], ['embodied', 'medical'], ['gaming', 'systems'],
]
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))

function glowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.3, 'rgba(200,255,250,0.85)')
  grd.addColorStop(0.6, 'rgba(91,233,219,0.35)')
  grd.addColorStop(1, 'rgba(91,233,219,0)')
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

export function Constellation3D({ lang }) {
  const canvas = useRef(null)
  const [active, setActive] = useState('core')
  const node = byId[active]
  useEffect(() => {
    let cleanup
    try { cleanup = init(canvas.current, setActive) } catch (e) { console.warn('Constellation3D disabled:', e) }
    return () => { try { cleanup && cleanup() } catch { /* noop */ } }
  }, [])
  return (
    <div className="c3d-wrap">
      <canvas ref={canvas} className="c3d-canvas" data-cur />
      <div className="const-caption">
        <span className="c-kicker">{lang === 'zh' ? '领域' : 'domain'}</span>
        <strong>{pick(node.label, lang)}</strong>
        <p>{pick(node.blurb, lang)}</p>
        <span className="c3d-hint">{lang === 'zh' ? '拖动旋转 · 悬停查看' : 'drag to rotate · hover a star'}</span>
      </div>
    </div>
  )
}

function init(canvas, setActive) {
  if (!canvas) return
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
  camera.position.set(0, 0, 230)

  const group = new THREE.Group(); scene.add(group)
  const tex = glowTex()

  // edges
  const epts = []
  EDGES.forEach(([a, b]) => { epts.push(...byId[a].pos, ...byId[b].pos) })
  const egeo = new THREE.BufferGeometry()
  egeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(epts), 3))
  const emat = new THREE.LineBasicMaterial({ color: 0x2bb6ad, transparent: true, opacity: 0.4 })
  group.add(new THREE.LineSegments(egeo, emat))

  // star sprites (one per node, own material so we can highlight)
  const sprites = NODES.map((n) => {
    const m = new THREE.SpriteMaterial({ map: tex, color: 0x9af0e8, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
    const s = new THREE.Sprite(m); s.position.set(...n.pos); s.scale.setScalar(n.r * 2.2)
    s.userData = { id: n.id, base: n.r * 2.2 }
    group.add(s); return s
  })

  const size = () => {
    const w = canvas.clientWidth || 480, h = canvas.clientHeight || 480
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
  }
  size(); const ro = new ResizeObserver(size); ro.observe(canvas)

  // interaction: drag to rotate (inertia) + hover to pick
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2()
  let dragging = false, lx = 0, ly = 0, vx = 0, vy = 0, activeId = 'core', raf
  const down = (e) => { dragging = true; lx = e.clientX; ly = e.clientY }
  const up = () => { dragging = false }
  const move = (e) => {
    if (dragging) {
      vy = (e.clientX - lx) * 0.006; vx = (e.clientY - ly) * 0.006
      group.rotation.y += vy; group.rotation.x += vx; lx = e.clientX; ly = e.clientY
    } else {
      const r = canvas.getBoundingClientRect()
      ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1
      ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1
      ray.setFromCamera(ptr, camera)
      const hit = ray.intersectObjects(sprites)
      if (hit.length) { activeId = hit[0].object.userData.id; setActive(activeId) }
    }
  }
  canvas.addEventListener('pointerdown', down)
  addEventListener('pointerup', up)
  canvas.addEventListener('pointermove', move)

  const tick = () => {
    if (!dragging) {
      group.rotation.y += (reduce ? 0 : 0.0024) + vy
      group.rotation.x += vx
      vx *= 0.93; vy *= 0.93
    }
    group.rotation.x = Math.max(-0.9, Math.min(0.9, group.rotation.x))
    sprites.forEach((s) => {
      const on = s.userData.id === activeId
      const target = s.userData.base * (on ? 1.7 : 1)
      s.scale.x += (target - s.scale.x) * 0.15; s.scale.y = s.scale.x
      s.material.color.set(on ? 0xffffff : 0x9af0e8)
    })
    emat.opacity = 0.3 + 0.15 * Math.sin(performance.now() * 0.0015)
    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf); ro.disconnect()
    canvas.removeEventListener('pointerdown', down); removeEventListener('pointerup', up); canvas.removeEventListener('pointermove', move)
    egeo.dispose(); emat.dispose(); tex.dispose(); sprites.forEach((s) => s.material.dispose()); renderer.dispose()
  }
}
