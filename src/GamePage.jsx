import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import './GamePage.css'

const MotionDiv = motion.div
const MotionSection = motion.section

const BOARD_SIZE = 14
const BASE_TICK = 220
const MIN_TICK = 92
const PRISM_INTERVAL = 3
const PRISM_POINTS = 35
const STORAGE_KEY = 'nebula-coil-leaderboard'
const NAME_KEY = 'nebula-coil-player'
const LEADERBOARD_LIMIT = 10

const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITES = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

const CONTROL_GROUPS = [
  [{ label: 'W / ↑', direction: 'up' }],
  [
    { label: 'A / ←', direction: 'left' },
    { label: 'D / →', direction: 'right' },
  ],
  [{ label: 'S / ↓', direction: 'down' }],
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const sameCell = (a, b) => a && b && a.x === b.x && a.y === b.y
const cellKey = (cell) => `${cell.x}:${cell.y}`
const isInsideBoard = (cell) =>
  cell.x >= 0 && cell.x < BOARD_SIZE && cell.y >= 0 && cell.y < BOARD_SIZE

const safeRead = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const writeStorage = (key, value) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage quota issues and keep the game playable.
  }
}

const sortLeaderboard = (entries) =>
  [...entries]
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score
      if (right.apples !== left.apples) return right.apples - left.apples
      if (right.length !== left.length) return right.length - left.length
      return left.durationMs - right.durationMs
    })
    .slice(0, LEADERBOARD_LIMIT)

const createInitialSnake = () => {
  const center = Math.floor(BOARD_SIZE / 2)
  return [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
    { x: center - 3, y: center },
  ]
}

const pickFreeCell = (blocked) => {
  const open = []
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const key = `${x}:${y}`
      if (!blocked.has(key)) {
        open.push({ x, y })
      }
    }
  }
  return open[Math.floor(Math.random() * open.length)]
}

const createGatePair = (snake, food, prism) => {
  const blocked = new Set(snake.map(cellKey))
  if (food) blocked.add(cellKey(food))
  if (prism) blocked.add(cellKey(prism))

  const candidates = []
  for (let index = 1; index < BOARD_SIZE - 1; index += 1) {
    candidates.push({ x: index, y: 0 })
    candidates.push({ x: index, y: BOARD_SIZE - 1 })
    candidates.push({ x: 0, y: index })
    candidates.push({ x: BOARD_SIZE - 1, y: index })
  }

  const free = candidates.filter((cell) => !blocked.has(cellKey(cell)))
  const first = free[Math.floor(Math.random() * free.length)]
  const secondPool = free.filter(
    (cell) =>
      !sameCell(cell, first) &&
      Math.abs(cell.x - first.x) + Math.abs(cell.y - first.y) > BOARD_SIZE / 2,
  )
  const second =
    secondPool[Math.floor(Math.random() * secondPool.length)] ||
    free.find((cell) => !sameCell(cell, first))

  return [first, second]
}

const createFood = (snake, gates, prism) => {
  const blocked = new Set(snake.map(cellKey))
  gates.forEach((gate) => blocked.add(cellKey(gate)))
  if (prism) blocked.add(cellKey(prism))
  return pickFreeCell(blocked)
}

const createPrism = (snake, food, gates) => {
  const blocked = new Set(snake.map(cellKey))
  blocked.add(cellKey(food))
  gates.forEach((gate) => blocked.add(cellKey(gate)))
  return pickFreeCell(blocked)
}

const createGameState = () => {
  const snake = createInitialSnake()
  const gates = createGatePair(snake)
  const food = createFood(snake, gates)

  return {
    boardSize: BOARD_SIZE,
    status: 'idle',
    snake,
    previousSnake: snake,
    direction: 'right',
    queuedDirection: 'right',
    food,
    prism: null,
    gates,
    score: 0,
    apples: 0,
    combo: 0,
    multiplier: 1,
    tickMs: BASE_TICK,
    speedStage: 0,
    startTime: 0,
    durationMs: 0,
    lastTickAt: 0,
    lastPickupAt: 0,
    pulseAt: 0,
    gateFlashAt: 0,
    message: 'Collect blue cores. Gold prisms spike your score.',
    hasSavedScore: false,
  }
}

const snapshotGame = (engine) => ({
  status: engine.status,
  score: engine.score,
  apples: engine.apples,
  combo: engine.combo,
  multiplier: engine.multiplier,
  speedStage: engine.speedStage,
  tickMs: engine.tickMs,
  durationMs: engine.durationMs,
  length: engine.snake.length,
  message: engine.message,
})

const canTurn = (current, next) => next && OPPOSITES[current] !== next

const moveHead = (head, direction) => ({
  x: head.x + DIRECTIONS[direction].x,
  y: head.y + DIRECTIONS[direction].y,
})

const formatDuration = (durationMs) => {
  const seconds = Math.floor(durationMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}:${String(remainder).padStart(2, '0')}`
}

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))

const saveScore = (leaderboard, playerName, engine) => {
  const entry = {
    name: playerName.trim() || 'Guest Pilot',
    score: engine.score,
    apples: engine.apples,
    length: engine.snake.length,
    durationMs: engine.durationMs,
    createdAt: new Date().toISOString(),
  }

  const nextEntries = sortLeaderboard([...leaderboard, entry])
  writeStorage(STORAGE_KEY, nextEntries)

  return {
    entries: nextEntries,
    rank:
      nextEntries.findIndex(
        (candidate) =>
          candidate.createdAt === entry.createdAt &&
          candidate.score === entry.score &&
          candidate.name === entry.name,
      ) + 1,
  }
}

const resetGame = (engine, time) => {
  const fresh = createGameState()
  Object.assign(engine, fresh)
  engine.status = 'playing'
  engine.startTime = time
  engine.lastTickAt = time
  engine.durationMs = 0
}

const finishGame = (engine, time) => {
  engine.status = 'gameover'
  engine.durationMs = time - engine.startTime
  engine.message = 'Signal lost. Reboot the coil and chase a cleaner line.'
}

const advanceGame = (engine, time) => {
  if (engine.status !== 'playing') return null

  if (canTurn(engine.direction, engine.queuedDirection)) {
    engine.direction = engine.queuedDirection
  }

  const currentHead = engine.snake[0]
  let nextHead = moveHead(currentHead, engine.direction)

  if (sameCell(nextHead, engine.gates[0])) {
    nextHead = { ...engine.gates[1] }
    engine.gateFlashAt = time
    engine.message = 'Gate sync locked. You slipped the grid.'
  } else if (sameCell(nextHead, engine.gates[1])) {
    nextHead = { ...engine.gates[0] }
    engine.gateFlashAt = time
    engine.message = 'Gate sync locked. You slipped the grid.'
  }

  if (!isInsideBoard(nextHead)) {
    finishGame(engine, time)
    return { type: 'gameover' }
  }

  const willEatFood = sameCell(nextHead, engine.food)
  const willEatPrism = engine.prism && sameCell(nextHead, engine.prism)
  const growth = willEatPrism ? 2 : willEatFood ? 1 : 0

  const bodyToCheck = engine.snake.slice(0, engine.snake.length - (growth > 0 ? 0 : 1))
  if (bodyToCheck.some((segment) => sameCell(segment, nextHead))) {
    finishGame(engine, time)
    return { type: 'gameover' }
  }

  engine.previousSnake = engine.snake.map((segment) => ({ ...segment }))

  const nextSnake = [nextHead, ...engine.snake]
  if (growth === 0) nextSnake.pop()
  engine.snake = nextSnake

  if (willEatFood || willEatPrism) {
    const pickupDelta = time - engine.lastPickupAt
    engine.combo =
      engine.lastPickupAt > 0 && pickupDelta < 2600 ? engine.combo + 1 : 1
    engine.multiplier = clamp(1 + Math.floor(engine.combo / 2), 1, 4)
    engine.lastPickupAt = time
    engine.pulseAt = time
  } else if (time - engine.lastPickupAt > 3200) {
    engine.combo = 0
    engine.multiplier = 1
  }

  if (willEatFood) {
    engine.apples += 1
    engine.score += 10 * engine.multiplier
    engine.message =
      engine.multiplier > 1 ? 'Combo stable. Keep the rhythm.' : 'Core captured.'
    if (engine.apples % 4 === 0) {
      engine.speedStage += 1
      engine.tickMs = clamp(BASE_TICK - engine.speedStage * 14, MIN_TICK, BASE_TICK)
    }
    if (engine.apples % 5 === 0) {
      engine.gates = createGatePair(engine.snake, engine.food, engine.prism)
    }
  }

  if (willEatPrism) {
    engine.score += PRISM_POINTS * engine.multiplier
    engine.message = 'Gold prism locked. Bonus growth and score surge.'
    engine.prism = null
  }

  if (willEatFood || willEatPrism) {
    engine.food = createFood(engine.snake, engine.gates, engine.prism)
    if (!engine.prism && engine.apples > 0 && engine.apples % PRISM_INTERVAL === 0) {
      engine.prism = createPrism(engine.snake, engine.food, engine.gates)
    }
  }

  return null
}

const ensureCanvas = (canvas) => {
  const context = canvas.getContext('2d')
  const bounds = canvas.getBoundingClientRect()
  const width = bounds.width
  const height = bounds.height
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
    canvas.width = width * dpr
    canvas.height = height * dpr
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { context, width, height }
}

const createProjector = (width, height) => {
  const tile = Math.min(width / (BOARD_SIZE * 1.9), height / (BOARD_SIZE * 1.16))
  const originX = width * 0.5
  const originY = height * 0.12

  return {
    tile,
    project(x, y, z = 0) {
      return {
        x: originX + (x - y) * tile * 0.72,
        y: originY + (x + y) * tile * 0.38 - z * tile,
      }
    },
  }
}

const drawFace = (context, points, fill, stroke) => {
  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  for (let index = 1; index < points.length; index += 1) {
    context.lineTo(points[index].x, points[index].y)
  }
  context.closePath()
  context.fillStyle = fill
  context.fill()
  if (stroke) {
    context.strokeStyle = stroke
    context.stroke()
  }
}

const drawCube = (context, projector, cell, height, colors) => {
  const topNorth = projector.project(cell.x, cell.y, height)
  const topEast = projector.project(cell.x + 1, cell.y, height)
  const topSouth = projector.project(cell.x + 1, cell.y + 1, height)
  const topWest = projector.project(cell.x, cell.y + 1, height)

  const bottomNorth = projector.project(cell.x, cell.y, 0)
  const bottomEast = projector.project(cell.x + 1, cell.y, 0)
  const bottomSouth = projector.project(cell.x + 1, cell.y + 1, 0)
  const bottomWest = projector.project(cell.x, cell.y + 1, 0)

  drawFace(
    context,
    [bottomNorth, bottomEast, topEast, topNorth],
    colors.right,
    'rgba(255, 255, 255, 0.04)',
  )
  drawFace(
    context,
    [bottomNorth, bottomWest, topWest, topNorth],
    colors.left,
    'rgba(255, 255, 255, 0.04)',
  )
  drawFace(
    context,
    [topNorth, topEast, topSouth, topWest],
    colors.top,
    'rgba(255, 255, 255, 0.08)',
  )
  drawFace(
    context,
    [bottomWest, bottomSouth, topSouth, topWest],
    colors.front,
    'rgba(255, 255, 255, 0.04)',
  )
}

const drawFloor = (context, projector, time) => {
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const north = projector.project(x, y, 0)
      const east = projector.project(x + 1, y, 0)
      const south = projector.project(x + 1, y + 1, 0)
      const west = projector.project(x, y + 1, 0)
      const pulse = 0.06 + ((x + y) % 2) * 0.03 + Math.sin(time * 0.001 + x * 0.5) * 0.01
      drawFace(
        context,
        [north, east, south, west],
        `rgba(10, 20, 36, ${0.55 + pulse})`,
        'rgba(154, 227, 255, 0.08)',
      )
    }
  }
}

const drawGate = (context, projector, gate, time, active) => {
  const center = projector.project(gate.x + 0.5, gate.y + 0.5, 0.1)
  const radius = projector.tile * 0.55
  const ring = 0.8 + Math.sin(time * 0.008 + gate.x) * 0.2

  context.save()
  context.strokeStyle = active ? 'rgba(255, 184, 106, 0.95)' : 'rgba(55, 207, 255, 0.72)'
  context.lineWidth = 2.2
  context.beginPath()
  context.ellipse(center.x, center.y, radius * ring, radius * 0.42 * ring, 0, 0, Math.PI * 2)
  context.stroke()

  context.strokeStyle = active ? 'rgba(255, 184, 106, 0.32)' : 'rgba(55, 207, 255, 0.24)'
  context.lineWidth = 6
  context.beginPath()
  context.ellipse(center.x, center.y, radius * ring, radius * 0.42 * ring, 0, 0, Math.PI * 2)
  context.stroke()
  context.restore()
}

const drawOrb = (context, projector, cell, time, colors) => {
  const center = projector.project(cell.x + 0.5, cell.y + 0.5, 0.95 + Math.sin(time * 0.006) * 0.08)
  const glow = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, projector.tile)
  glow.addColorStop(0, colors.inner)
  glow.addColorStop(1, colors.outer)

  context.save()
  context.fillStyle = glow
  context.beginPath()
  context.arc(center.x, center.y, projector.tile * 0.46, 0, Math.PI * 2)
  context.fill()
  context.restore()
}

const drawPrism = (context, projector, cell, time) => {
  const height = 1.2 + Math.sin(time * 0.007) * 0.08
  drawCube(context, projector, cell, height, {
    top: 'rgba(255, 214, 133, 0.98)',
    left: 'rgba(199, 118, 42, 0.95)',
    right: 'rgba(255, 153, 77, 0.95)',
    front: 'rgba(255, 185, 92, 0.82)',
  })
}

const drawSnake = (context, projector, engine, time) => {
  const alpha =
    engine.status === 'playing'
      ? clamp((time - engine.lastTickAt) / engine.tickMs, 0, 1)
      : 1

  const flash = clamp(1 - (time - engine.pulseAt) / 420, 0, 1)

  for (let index = engine.snake.length - 1; index >= 0; index -= 1) {
    const segment = engine.snake[index]
    const previous = engine.previousSnake[index] || segment
    const jumped =
      Math.abs(segment.x - previous.x) > 1 || Math.abs(segment.y - previous.y) > 1

    const cell = jumped
      ? segment
      : {
          x: previous.x + (segment.x - previous.x) * alpha,
          y: previous.y + (segment.y - previous.y) * alpha,
        }

    const isHead = index === 0
    const height = isHead ? 1.28 : clamp(1 - index * 0.04, 0.5, 1.02)
    const glowBoost = isHead ? 0.24 + flash * 0.18 : 0.12 + flash * 0.08

    drawCube(context, projector, cell, height, {
      top: isHead
        ? `rgba(194, 244, 255, ${0.94 + flash * 0.04})`
        : `rgba(120, 230, 255, ${0.88 + glowBoost})`,
      left: isHead ? 'rgba(37, 144, 188, 0.98)' : 'rgba(14, 88, 132, 0.92)',
      right: isHead ? 'rgba(62, 194, 255, 0.98)' : 'rgba(27, 133, 186, 0.94)',
      front: isHead ? 'rgba(72, 178, 255, 0.88)' : 'rgba(26, 112, 160, 0.8)',
    })

    const center = projector.project(cell.x + 0.5, cell.y + 0.5, height + 0.08)
    const shadowCenter = projector.project(cell.x + 0.5, cell.y + 0.5, 0)
    context.save()
    context.fillStyle = isHead
      ? `rgba(55, 207, 255, ${0.14 + flash * 0.24})`
      : 'rgba(55, 207, 255, 0.08)'
    context.beginPath()
    context.ellipse(
      shadowCenter.x,
      shadowCenter.y + projector.tile * 0.2,
      projector.tile * 0.48,
      projector.tile * 0.18,
      0,
      0,
      Math.PI * 2,
    )
    context.fill()

    if (isHead) {
      context.fillStyle = 'rgba(5, 10, 18, 0.85)'
      context.beginPath()
      context.arc(center.x - projector.tile * 0.13, center.y, projector.tile * 0.06, 0, Math.PI * 2)
      context.arc(center.x + projector.tile * 0.13, center.y, projector.tile * 0.06, 0, Math.PI * 2)
      context.fill()
    }
    context.restore()
  }
}

const renderGame = (canvas, engine, time) => {
  if (!canvas) return

  const { context, width, height } = ensureCanvas(canvas)
  const projector = createProjector(width, height)

  context.clearRect(0, 0, width, height)

  const background = context.createLinearGradient(0, 0, 0, height)
  background.addColorStop(0, 'rgba(8, 18, 34, 0.96)')
  background.addColorStop(1, 'rgba(4, 8, 18, 1)')
  context.fillStyle = background
  context.fillRect(0, 0, width, height)

  const glow = context.createRadialGradient(
    width * 0.64,
    height * 0.22,
    0,
    width * 0.5,
    height * 0.55,
    width * 0.52,
  )
  glow.addColorStop(0, 'rgba(55, 207, 255, 0.14)')
  glow.addColorStop(1, 'rgba(55, 207, 255, 0)')
  context.fillStyle = glow
  context.fillRect(0, 0, width, height)

  drawFloor(context, projector, time)
  const gateIsActive = time - engine.gateFlashAt < 300
  engine.gates.forEach((gate) => drawGate(context, projector, gate, time, gateIsActive))
  drawOrb(context, projector, engine.food, time, {
    inner: 'rgba(123, 235, 255, 0.96)',
    outer: 'rgba(55, 207, 255, 0)',
  })
  if (engine.prism) drawPrism(context, projector, engine.prism, time)
  drawSnake(context, projector, engine, time)
}

function GamePage() {
  const [playerName, setPlayerName] = useState(() => safeRead(NAME_KEY, 'Rongze'))
  const [leaderboard, setLeaderboard] = useState(() =>
    sortLeaderboard(safeRead(STORAGE_KEY, [])),
  )
  const [engine] = useState(createGameState)
  const canvasRef = useRef(null)
  const animationRef = useRef(0)
  const playerNameRef = useRef(playerName)
  const leaderboardRef = useRef(leaderboard)
  const uiUpdateRef = useRef(0)
  const engineRef = useRef(engine)
  const [ui, setUi] = useState(() => snapshotGame(engine))
  const [latestRank, setLatestRank] = useState(null)

  useEffect(() => {
    playerNameRef.current = playerName
    writeStorage(NAME_KEY, playerName)
  }, [playerName])

  useEffect(() => {
    leaderboardRef.current = leaderboard
  }, [leaderboard])

  const beginRun = useCallback((direction) => {
    const now = performance.now()
    resetGame(engineRef.current, now)
    if (direction && canTurn(engineRef.current.direction, direction)) {
      engineRef.current.queuedDirection = direction
    }
    setLatestRank(null)
  }, [])

  const togglePause = useCallback(() => {
    const engine = engineRef.current
    if (engine.status === 'playing') {
      engine.status = 'paused'
      engine.message = 'Coil frozen. Hit space or pause to resume.'
      return
    }

    if (engine.status === 'paused') {
      const now = performance.now()
      engine.status = 'playing'
      engine.startTime += now - engine.lastTickAt
      engine.lastTickAt = now
      engine.message = 'Coil back online.'
    }
  }, [])

  const queueDirection = useCallback((direction) => {
    const engine = engineRef.current

    if (engine.status === 'idle' || engine.status === 'gameover') {
      beginRun(direction)
      return
    }

    if (engine.status === 'paused') {
      togglePause()
    }

    if (canTurn(engine.direction, direction)) {
      engine.queuedDirection = direction
    }
  }, [beginRun, togglePause])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ' || event.key === 'Spacebar') {
        event.preventDefault()
        togglePause()
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        beginRun()
        return
      }

      const directionMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        W: 'up',
        s: 'down',
        S: 'down',
        a: 'left',
        A: 'left',
        d: 'right',
        D: 'right',
      }

      const direction = directionMap[event.key]
      if (direction) {
        event.preventDefault()
        queueDirection(direction)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [beginRun, queueDirection, togglePause])

  useEffect(() => {
    const loop = (time) => {
      const engine = engineRef.current

      if (engine.status === 'playing') {
        while (time - engine.lastTickAt >= engine.tickMs) {
          const result = advanceGame(engine, engine.lastTickAt + engine.tickMs)
          engine.lastTickAt += engine.tickMs

          if (result?.type === 'gameover' && !engine.hasSavedScore && engine.score > 0) {
            const saved = saveScore(leaderboardRef.current, playerNameRef.current, engine)
            engine.hasSavedScore = true
            leaderboardRef.current = saved.entries
            setLeaderboard(saved.entries)
            setLatestRank(saved.rank)
          }
        }

        engine.durationMs = time - engine.startTime
      }

      renderGame(canvasRef.current, engine, time)

      if (time - uiUpdateRef.current > 48) {
        setUi(snapshotGame(engine))
        uiUpdateRef.current = time
      }

      animationRef.current = window.requestAnimationFrame(loop)
    }

    animationRef.current = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(animationRef.current)
  }, [])

  const bestEntry = leaderboard[0]

  return (
    <div className="game-shell">
      <header className="game-header">
        <a className="game-mark" href="./">
          Rongze Gao
        </a>
        <nav>
          <a href="./">Back to Portfolio</a>
          <a href="https://github.com/zeron-G/rongze-gao-portfolio" target="_blank" rel="noreferrer">
            Source
          </a>
        </nav>
      </header>

      <main className="game-main">
        <MotionSection
          className="game-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="game-copy">
            <p className="game-eyebrow">Signal Arcade</p>
            <h1>Nebula Coil</h1>
            <p className="game-summary">
              A neon 3D-style snake run hidden inside the portfolio. Ride warp gates,
              chain combos, catch gold prisms, and climb the local leaderboard.
            </p>

            <div className="game-actions">
              <button type="button" onClick={() => beginRun()}>
                {ui.status === 'idle' || ui.status === 'gameover' ? 'Launch Run' : 'Reboot Run'}
              </button>
              <button type="button" onClick={togglePause}>
                {ui.status === 'paused' ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>

          <div className="game-callout">
            <span className="callout-label">Pilot Handle</span>
            <label htmlFor="player-name">Name on the leaderboard</label>
            <input
              id="player-name"
              maxLength={16}
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Enter a callsign"
            />
            <p>{ui.message}</p>
          </div>
        </MotionSection>

        <section className="game-layout">
          <div className="arena-column">
            <div className="arena-panel">
              <div className="arena-stats">
                <article>
                  <span>Score</span>
                  <strong>{ui.score}</strong>
                </article>
                <article>
                  <span>Length</span>
                  <strong>{ui.length}</strong>
                </article>
                <article>
                  <span>Combo</span>
                  <strong>{ui.multiplier}x</strong>
                </article>
                <article>
                  <span>Time</span>
                  <strong>{formatDuration(ui.durationMs)}</strong>
                </article>
              </div>

              <div className="arena-canvas-shell">
                <canvas ref={canvasRef} className="arena-canvas" />
                <div className="arena-overlay">
                  {ui.status === 'idle' && (
                    <div className="status-card">
                      <strong>Ready on the runway</strong>
                      <p>Hit Enter or Launch Run. Use arrows / WASD or the control pad.</p>
                    </div>
                  )}

                  {ui.status === 'paused' && (
                    <div className="status-card">
                      <strong>Paused</strong>
                      <p>Space or Resume brings the coil back online.</p>
                    </div>
                  )}

                  {ui.status === 'gameover' && (
                    <div className="status-card">
                      <strong>Run complete</strong>
                      <p>
                        Final score {ui.score}.{' '}
                        {latestRank ? `You landed at rank #${latestRank}.` : 'Rename yourself and launch again to climb.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="arena-legend">
                <article>
                  <span className="legend-dot orb" />
                  <div>
                    <strong>Blue core</strong>
                    <p>Base points and growth. Keep collecting fast to build combo.</p>
                  </div>
                </article>
                <article>
                  <span className="legend-dot prism" />
                  <div>
                    <strong>Gold prism</strong>
                    <p>Bonus score spike, extra growth, and a momentum reset in your favor.</p>
                  </div>
                </article>
                <article>
                  <span className="legend-dot gate" />
                  <div>
                    <strong>Warp gates</strong>
                    <p>Slip through one side and emerge from the other. Great for risky recoveries.</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="control-panel">
              <div className="control-copy">
                <p className="game-eyebrow">Touch Controls</p>
                <h2>Playable on phone, keyboard, or pure nerves.</h2>
                <p>
                  The board is tuned for quick runs. Speed ramps every four blue cores,
                  so the safest line early is rarely the winning line later.
                </p>
              </div>

              <div className="control-pad">
                {CONTROL_GROUPS.map((group, index) => (
                  <div className="control-row" key={`row-${index}`}>
                    {group.map((control) => (
                      <button
                        key={control.direction}
                        type="button"
                        onClick={() => queueDirection(control.direction)}
                      >
                        {control.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="sidebar-column">
            <div className="leaderboard-panel">
              <div className="leaderboard-head">
                <div>
                  <p className="game-eyebrow">Top Pilots</p>
                  <h2>Local Leaderboard</h2>
                </div>
                {bestEntry ? (
                  <div className="best-score">
                    <span>Best run</span>
                    <strong>{bestEntry.score}</strong>
                  </div>
                ) : null}
              </div>

              <div className="leaderboard-list">
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry, index) => (
                    <article key={`${entry.createdAt}-${entry.name}`}>
                      <div>
                        <span>#{index + 1}</span>
                        <strong>{entry.name}</strong>
                      </div>
                      <div>
                        <span>{entry.score}</span>
                        <small>
                          {entry.length} length · {formatDate(entry.createdAt)}
                        </small>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="leaderboard-empty">
                    <strong>No runs saved yet.</strong>
                    <p>Finish one clean run and your callsign lands here automatically.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="stats-panel">
              <article>
                <span>Current speed</span>
                <strong>{Math.round((BASE_TICK / ui.tickMs) * 100)}%</strong>
              </article>
              <article>
                <span>Collected cores</span>
                <strong>{ui.apples}</strong>
              </article>
              <article>
                <span>Combo chain</span>
                <strong>{ui.combo}</strong>
              </article>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default GamePage
