import { useEffect, useRef, useState } from 'react'

export function CursorRipples() {
  const [ripples, setRipples] = useState([])
  const rippleIdRef = useRef(0)
  const lastMoveRef = useRef(0)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)')
    if (mediaQuery.matches) {
      return undefined
    }

    const spawnRipple = (x, y, scale = 1) => {
      const id = rippleIdRef.current
      rippleIdRef.current += 1
      setRipples((prev) => [...prev.slice(-10), { id, x, y, scale }])
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== id))
      }, 900)
    }

    const handleMove = (event) => {
      const now = performance.now()
      if (now - lastMoveRef.current < 140) {
        return
      }
      lastMoveRef.current = now
      spawnRipple(event.clientX, event.clientY, 0.72)
    }

    const handleDown = (event) => {
      spawnRipple(event.clientX, event.clientY, 1.18)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerdown', handleDown)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerdown', handleDown)
    }
  }, [])

  return (
    <div className="ripple-layer" aria-hidden="true">
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="cursor-ripple"
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px`, '--scale': ripple.scale }}
        />
      ))}
    </div>
  )
}
