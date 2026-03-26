import { useEffect, useRef } from 'react'

export function NetworkNebula() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return undefined
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return undefined
    }

    const pointer = { x: 0.5, y: 0.5, force: 0.2 }
    let frameId = 0
    let width = 0
    let height = 0

    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0015,
      vy: (Math.random() - 0.5) * 0.0015,
      size: 1 + Math.random() * 2.2,
    }))

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const tick = () => {
      context.clearRect(0, 0, width, height)

      const glow = context.createRadialGradient(
        width * pointer.x,
        height * pointer.y,
        0,
        width * pointer.x,
        height * pointer.y,
        width * 0.5,
      )
      glow.addColorStop(0, 'rgba(151, 130, 255, 0.2)')
      glow.addColorStop(1, 'rgba(151, 130, 255, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      for (const node of nodes) {
        const dx = pointer.x - node.x
        const dy = pointer.y - node.y
        const dist = Math.max(Math.hypot(dx, dy), 0.001)
        node.vx += (dx / dist) * pointer.force * 0.00008
        node.vy += (dy / dist) * pointer.force * 0.00008
        node.vx *= 0.985
        node.vy *= 0.985
        node.x += node.vx
        node.y += node.vy

        if (node.x < -0.05) node.x = 1.05
        if (node.x > 1.05) node.x = -0.05
        if (node.y < -0.05) node.y = 1.05
        if (node.y > 1.05) node.y = -0.05
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < 0.2) {
            context.strokeStyle = `rgba(120, 194, 255, ${0.18 - dist * 0.6})`
            context.lineWidth = 1
            context.beginPath()
            context.moveTo(a.x * width, a.y * height)
            context.lineTo(b.x * width, b.y * height)
            context.stroke()
          }
        }
      }

      for (const node of nodes) {
        context.fillStyle = 'rgba(205, 215, 255, 0.85)'
        context.beginPath()
        context.arc(node.x * width, node.y * height, node.size, 0, Math.PI * 2)
        context.fill()
      }

      frameId = window.requestAnimationFrame(tick)
    }

    const onPointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = (event.clientX - bounds.left) / bounds.width
      pointer.y = (event.clientY - bounds.top) / bounds.height
      pointer.force = 0.42
    }

    const onPointerLeave = () => {
      pointer.x = 0.5
      pointer.y = 0.5
      pointer.force = 0.2
    }

    resize()
    frameId = window.requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return <canvas className="nebula-canvas" ref={canvasRef} aria-hidden="true" />
}
