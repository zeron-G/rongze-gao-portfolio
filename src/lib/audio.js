/* Fully synthesized, original soundscape (Web Audio API) — no audio files.
   A slow evolving space-pad as ambient "music", plus soft synth blips for UI.
   Never autoplays: the context is created + resumed only on a user gesture. */

let ctx = null
let master = null
let on = false
let started = false

function makeIR(c, dur = 2.8, decay = 2.4) {
  const len = Math.floor(c.sampleRate * dur)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

function ensure() {
  if (ctx) return true
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return false
  ctx = new AC()
  master = ctx.createGain(); master.gain.value = 0
  const dry = ctx.createGain(); dry.gain.value = 0.75
  const wet = ctx.createGain(); wet.gain.value = 0.55
  const rev = ctx.createConvolver(); rev.buffer = makeIR(ctx)
  master.connect(dry).connect(ctx.destination)
  master.connect(rev).connect(wet).connect(ctx.destination)
  return true
}

function startPad() {
  if (started) return
  started = true
  // an open, airy chord (D / A / E) across octaves — spacey, unresolved
  const chord = [73.42, 110.0, 146.83, 220.0, 329.63]
  chord.forEach((f, i) => {
    for (const det of [-7, 7]) {
      const o = ctx.createOscillator()
      o.type = i < 2 ? 'sine' : 'triangle'
      o.frequency.value = f; o.detune.value = det
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100 - i * 90
      const g = ctx.createGain(); g.gain.value = 0.055 / (i + 1)
      // slow breathing
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.04 + Math.random() * 0.07
      const lg = ctx.createGain(); lg.gain.value = 0.03 / (i + 1)
      lfo.connect(lg).connect(g.gain)
      o.connect(lp).connect(g).connect(master)
      o.start(); lfo.start()
    }
  })
  // faint high shimmer with tremolo
  const sh = ctx.createOscillator(); sh.type = 'sine'; sh.frequency.value = 1318.5
  const shg = ctx.createGain(); shg.gain.value = 0.006
  const trem = ctx.createOscillator(); trem.frequency.value = 0.6
  const tg = ctx.createGain(); tg.gain.value = 0.006
  trem.connect(tg).connect(shg.gain)
  sh.connect(shg).connect(master); sh.start(); trem.start()
}

export const audio = {
  isOn: () => on,
  setEnabled(v) {
    if (!ensure()) return
    on = v
    if (v) {
      ctx.resume()
      startPad()
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0.42, ctx.currentTime + 1.6)
    } else {
      master.gain.cancelScheduledValues(ctx.currentTime)
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
    }
  },
  blip(freq = 760, dur = 0.08, vol = 0.035) {
    if (!on || !ctx) return
    const t = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(master)
    o.start(t); o.stop(t + dur + 0.03)
  },
}
