import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* Intro: a counter races 0→100 over the ink while a word-mark holds, then the
   whole panel lifts away in two slabs to reveal the site. Pure front-end. */
export function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) { setPct(100); const id = setTimeout(onDone, 200); return () => clearTimeout(id) }
    let v = 0
    const id = setInterval(() => {
      v += Math.max(1, Math.round((100 - v) * 0.08)) + Math.round(Math.random() * 3)
      if (v >= 100) { v = 100; clearInterval(id); setTimeout(onDone, 520) }
      setPct(v)
    }, 34)
    return () => clearInterval(id)
  }, [onDone])
  return (
    <motion.div className="preloader" initial={{ opacity: 1 }}
      exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}>
      <div className="pre-inner">
        <span className="pre-tag">RONGZE GAO · PERSONAL SYSTEM</span>
        <span className="pre-pct">{String(pct).padStart(3, '0')}</span>
      </div>
      <div className="pre-bar"><motion.i style={{ scaleX: pct / 100 }} /></div>
    </motion.div>
  )
}
