import { useEffect, useRef } from 'react'

/* Custom cursor: a lerped ring + a snapping dot, mix-blend so it inverts over
   content. Grows over interactive elements. Falls back to the native cursor on
   touch / coarse pointers / reduced-motion. */
export function Cursor() {
  const ring = useRef(null)
  const dot = useRef(null)
  useEffect(() => {
    const fine = matchMedia('(pointer:fine)').matches
    const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches
    if (!fine || reduce) return
    document.documentElement.classList.add('has-cursor')
    const r = ring.current, d = dot.current
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      d.style.transform = `translate(${mx}px,${my}px)`
      const t = e.target.closest('a,button,[data-cur]')
      r.classList.toggle('hot', !!t)
    }
    addEventListener('pointermove', onMove)
    let raf
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18
      r.style.transform = `translate(${rx}px,${ry}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', onMove); document.documentElement.classList.remove('has-cursor') }
  }, [])
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
