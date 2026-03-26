import { useEffect, useRef } from 'react'

export function SignalField() {
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

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = { x: 0.72, y: 0.34, intensity: 0.18 }

    let frameId = 0
    let width = 0
    let height = 0
    let dpr = 1

    const nodes = Array.from({ length: 22 }, (_, index) => ({
      orbit: 0.2 + (index % 6) * 0.08 + Math.random() * 0.04,
      angle: (Math.PI * 2 * index) / 22,
      speed: 0.00018 + (index % 5) * 0.00006,
      radius: 1.8 + Math.random() * 2.6,
      drift: Math.random() * Math.PI * 2,
      opacity: 0.24 + Math.random() * 0.52,
    }))

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawGrid = (time) => {
      context.save()
      context.strokeStyle = 'rgba(170, 192, 255, 0.12)'
      context.lineWidth = 1

      for (let step = 0; step < 6; step += 1) {
        const y = height * (0.14 + step * 0.13)
        context.beginPath()
        context.moveTo(width * 0.07, y)
        context.lineTo(width * 0.93, y)
        context.stroke()
      }

      for (let step = 0; step < 8; step += 1) {
        const x = width * (0.1 + step * 0.1)
        context.beginPath()
        context.moveTo(x, height * 0.1)
        context.lineTo(x, height * 0.9)
        context.stroke()
      }

      context.translate(width * 0.62, height * 0.52)
      context.strokeStyle = 'rgba(154, 166, 255, 0.22)'

      ;[0.17, 0.3, 0.45, 0.62].forEach((ring) => {
        context.beginPath()
        context.arc(0, 0, Math.min(width, height) * ring, 0, Math.PI * 2)
        context.stroke()
      })

      context.setLineDash([8, 12])
      context.lineDashOffset = -time * 0.015
      context.strokeStyle = 'rgba(183, 128, 255, 0.34)'
      context.beginPath()
      context.arc(0, 0, Math.min(width, height) * 0.38, -Math.PI / 6, Math.PI / 2)
      context.stroke()
      context.restore()
    }

    const drawRoutes = (time) => {
      context.save()
      context.lineWidth = 1.2
      context.setLineDash([12, 10])
      context.lineDashOffset = -time * 0.025

      context.strokeStyle = 'rgba(108, 203, 255, 0.62)'
      context.beginPath()
      context.moveTo(width * 0.12, height * 0.8)
      context.bezierCurveTo(
        width * 0.3,
        height * 0.48,
        width * 0.58,
        height * 0.78,
        width * 0.84,
        height * 0.2,
      )
      context.stroke()

      context.strokeStyle = 'rgba(167, 115, 255, 0.58)'
      context.beginPath()
      context.moveTo(width * 0.16, height * 0.28)
      context.bezierCurveTo(
        width * 0.36,
        height * 0.16,
        width * 0.52,
        height * 0.56,
        width * 0.78,
        height * 0.64,
      )
      context.stroke()

      context.restore()
    }

    const drawNodes = (time) => {
      const centerX = width * 0.62
      const centerY = height * 0.52
      const maxRadius = Math.min(width, height) * 0.44

      nodes.forEach((node, index) => {
        const angle = node.angle + time * node.speed
        const radius = maxRadius * node.orbit
        const x =
          centerX +
          Math.cos(angle) * radius +
          Math.sin(time * 0.0002 + node.drift) * 12 +
          (pointer.x - 0.5) * 24 * pointer.intensity
        const y =
          centerY +
          Math.sin(angle) * radius * 0.72 +
          Math.cos(time * 0.00024 + node.drift) * 10 +
          (pointer.y - 0.5) * 22 * pointer.intensity

        context.beginPath()
        context.fillStyle = `rgba(166, 186, 255, ${node.opacity})`
        context.arc(x, y, node.radius, 0, Math.PI * 2)
        context.fill()

        context.beginPath()
        context.fillStyle = `rgba(170, 119, 255, ${0.08 + (index % 4) * 0.04})`
        context.arc(x, y, node.radius * 3, 0, Math.PI * 2)
        context.fill()

        context.beginPath()
        context.strokeStyle = 'rgba(166, 186, 255, 0.1)'
        context.moveTo(centerX, centerY)
        context.lineTo(x, y)
        context.stroke()
      })

      context.beginPath()
      context.fillStyle = 'rgba(122, 203, 255, 0.92)'
      context.arc(centerX, centerY, 6, 0, Math.PI * 2)
      context.fill()

      context.beginPath()
      context.strokeStyle = 'rgba(122, 203, 255, 0.28)'
      context.lineWidth = 14
      context.arc(centerX, centerY, 18, 0, Math.PI * 2)
      context.stroke()
    }

    const paint = (time) => {
      context.clearRect(0, 0, width, height)

      const baseGradient = context.createRadialGradient(
        width * 0.68,
        height * 0.3,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72,
      )
      baseGradient.addColorStop(0, 'rgba(30, 32, 84, 0.72)')
      baseGradient.addColorStop(0.55, 'rgba(10, 13, 34, 0.62)')
      baseGradient.addColorStop(1, 'rgba(6, 8, 20, 0.1)')
      context.fillStyle = baseGradient
      context.fillRect(0, 0, width, height)

      const pointerGlow = context.createRadialGradient(
        width * pointer.x,
        height * pointer.y,
        0,
        width * pointer.x,
        height * pointer.y,
        Math.max(width, height) * 0.22,
      )
      pointerGlow.addColorStop(0, 'rgba(164, 133, 255, 0.28)')
      pointerGlow.addColorStop(1, 'rgba(164, 133, 255, 0)')
      context.fillStyle = pointerGlow
      context.fillRect(0, 0, width, height)

      drawGrid(time)
      drawRoutes(time)
      drawNodes(time)
    }

    const animate = (time) => {
      paint(time)
      frameId = window.requestAnimationFrame(animate)
    }

    const render = () => {
      window.cancelAnimationFrame(frameId)
      if (mediaQuery.matches) {
        paint(0)
        return
      }
      frameId = window.requestAnimationFrame(animate)
    }

    const handlePointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = (event.clientX - bounds.left) / bounds.width
      pointer.y = (event.clientY - bounds.top) / bounds.height
      pointer.intensity = 0.45
    }

    const handlePointerLeave = () => {
      pointer.x = 0.72
      pointer.y = 0.34
      pointer.intensity = 0.18
    }

    resize()
    render()

    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerleave', handlePointerLeave)
    mediaQuery.addEventListener('change', render)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      mediaQuery.removeEventListener('change', render)
    }
  }, [])

  return <canvas className="signal-field-canvas" ref={canvasRef} aria-hidden="true" />
}
