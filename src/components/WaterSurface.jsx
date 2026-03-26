import { useEffect, useRef } from 'react'

export function WaterSurface() {
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
    if (mediaQuery.matches) {
      return undefined
    }

    let frameId = 0
    let width = 0
    let height = 0
    let cols = 0
    let rows = 0
    let current = new Float32Array(0)
    let previous = new Float32Array(0)
    let imageData = null
    let lastPointer = 0

    const indexAt = (x, y) => y * cols + x

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      cols = Math.max(64, Math.floor(width / 8))
      rows = Math.max(36, Math.floor(height / 8))
      canvas.width = cols
      canvas.height = rows
      current = new Float32Array(cols * rows)
      previous = new Float32Array(cols * rows)
      imageData = context.createImageData(cols, rows)
    }

    const disturb = (clientX, clientY, strength) => {
      const bounds = canvas.getBoundingClientRect()
      const x = Math.floor(((clientX - bounds.left) / bounds.width) * cols)
      const y = Math.floor(((clientY - bounds.top) / bounds.height) * rows)
      const radius = Math.max(2, Math.floor(Math.min(cols, rows) * 0.018))

      for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
        for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
          const distance = Math.hypot(offsetX, offsetY)
          if (distance > radius) {
            continue
          }
          const targetX = x + offsetX
          const targetY = y + offsetY
          if (targetX <= 1 || targetX >= cols - 1 || targetY <= 1 || targetY >= rows - 1) {
            continue
          }
          const falloff = 1 - distance / radius
          previous[indexAt(targetX, targetY)] += strength * falloff
        }
      }
    }

    const step = () => {
      const pixels = imageData.data

      for (let y = 1; y < rows - 1; y += 1) {
        for (let x = 1; x < cols - 1; x += 1) {
          const index = indexAt(x, y)
          const value =
            (
              previous[index - 1] +
              previous[index + 1] +
              previous[index - cols] +
              previous[index + cols]
            ) *
              0.5 -
            current[index]

          current[index] = value * 0.986

          const shade = Math.max(-1, Math.min(1, current[index] * 0.12))
          const alpha = Math.min(28, Math.abs(current[index]) * 0.22)
          const pixelIndex = index * 4

          pixels[pixelIndex] = shade > 0 ? 118 + shade * 80 : 80
          pixels[pixelIndex + 1] = 122 + Math.abs(shade) * 54
          pixels[pixelIndex + 2] = 168 + Math.abs(shade) * 72
          pixels[pixelIndex + 3] = alpha
        }
      }

      context.putImageData(imageData, 0, 0)
      const swap = previous
      previous = current
      current = swap
      frameId = window.requestAnimationFrame(step)
    }

    const onPointerMove = (event) => {
      const now = performance.now()
      if (now - lastPointer < 26) {
        return
      }
      lastPointer = now
      disturb(event.clientX, event.clientY, 120)
    }

    const onPointerDown = (event) => {
      disturb(event.clientX, event.clientY, 340)
    }

    resize()
    frameId = window.requestAnimationFrame(step)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  return <canvas ref={canvasRef} className="water-surface" aria-hidden="true" />
}
