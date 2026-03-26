import { useEffect, useRef } from 'react'

export function AuroraBackdrop() {
  const rootRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) {
      return undefined
    }

    let frameId = 0
    let pointerX = window.innerWidth * 0.55
    let pointerY = window.innerHeight * 0.3
    let targetX = pointerX
    let targetY = pointerY

    const update = () => {
      pointerX += (targetX - pointerX) * 0.08
      pointerY += (targetY - pointerY) * 0.08
      root.style.setProperty('--aurora-x', `${pointerX}px`)
      root.style.setProperty('--aurora-y', `${pointerY}px`)
      frameId = window.requestAnimationFrame(update)
    }

    const handleMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY
    }

    frameId = window.requestAnimationFrame(update)
    window.addEventListener('pointermove', handleMove)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', handleMove)
    }
  }, [])

  return (
    <div ref={rootRef} className="aurora-backdrop" aria-hidden="true">
      <div className="aurora-layer aurora-layer-primary" />
      <div className="aurora-layer aurora-layer-secondary" />
      <div className="aurora-layer aurora-layer-tertiary" />
    </div>
  )
}
