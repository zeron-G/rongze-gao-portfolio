import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import bgUrl from '../assets/blackhole-bg.jpg'

/* Pre-rendered Schwarzschild black hole as a fixed cosmic backdrop.
   No real-time ray tracing — the relativistic solve (gravitational lensing,
   Doppler-beamed accretion disk, photon ring) is baked into one image, tinted
   to the site's Tiffany-cyan palette. It dominates the hero, then recedes into
   the deep-space base as you scroll so the content below stays legible. */
export function BlackHoleBackdrop() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  // hero-forward, then fade back to a faint cosmic presence while reading
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.5], [1, 0.72, 0.16])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '13%'])

  return (
    <div className="bh-backdrop" aria-hidden="true">
      <motion.div className="bh-parallax" style={reduce ? { opacity: 0.85 } : { y, opacity }}>
        <div className="bh-img" style={{ backgroundImage: `url(${bgUrl})` }} />
      </motion.div>
      <div className="bh-scrim" />
    </div>
  )
}
