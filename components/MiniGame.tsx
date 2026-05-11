'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Canvas constants ──────────────────────────────────────────────────────────
const CW = 350   // canvas width
const CH = 160   // canvas height
const GY = 130   // ground y
const PX = 55    // player fixed x
const PH = 30    // player height  (head 10 + body 12 + max-leg 8)
const PW = 18    // player width   (body 14 + 4px backpack)
const GRAVITY = 0.6
const JUMP_V  = -10

interface LBEntry { name: string; score: number }

// ── Theme ─────────────────────────────────────────────────────────────────────
function theme(dark: boolean) {
  return {
    ink:    dark ? '#F0EDE6' : '#1C1A16',
    amber:  dark ? '#C49A5C' : '#B8864E',
    muted:  dark ? '#9A8E7E' : '#6B6358',
    ground: dark ? 'rgba(247,244,238,0.18)' : 'rgba(28,26,22,0.13)',
  }
}

// ── Web Audio "pip" ───────────────────────────────────────────────────────────
function pip(ac: AudioContext) {
  const osc = ac.createOscillator()
  const g   = ac.createGain()
  osc.connect(g); g.connect(ac.destination)
  osc.type = 'square'
  osc.frequency.setValueAtTime(880, ac.currentTime)
  osc.frequency.exponentialRampToValueAtTime(1400, ac.currentTime + 0.05)
  g.gain.setValueAtTime(0.07, ac.currentTime)
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05)
  osc.start()
  osc.stop(ac.currentTime + 0.06)
}

// ── Sprites ───────────────────────────────────────────────────────────────────
function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  frame: number, leaping: boolean, col: string,
) {
  ctx.fillStyle = col
  ctx.fillRect(x + 3,  y,      10, 10)  // head
  ctx.clearRect(x + 10, y + 3,  2,  2)  // eye (punched out)
  ctx.fillRect(x + 2,  y + 10, 12, 12)  // body
  ctx.fillRect(x + 14, y + 11,  4,  8)  // backpack protrusion
  if (leaping) {
    ctx.fillRect(x + 3, y + 22, 4, 4)   // tuck both legs
    ctx.fillRect(x + 8, y + 22, 4, 4)
  } else if (frame === 0) {
    ctx.fillRect(x + 2, y + 22, 4, 8)   // left leg forward
    ctx.fillRect(x + 8, y + 22, 4, 5)   // right leg back
  } else {
    ctx.fillRect(x + 2, y + 22, 4, 5)   // left leg back
    ctx.fillRect(x + 8, y + 22, 4, 8)   // right leg forward
  }
}

function drawCrab(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  frame: number, col: string,
) {
  ctx.fillStyle = col
  ctx.fillRect(x,      y,      20, 10)           // body
  const cy = y + (frame === 0 ? -2 : -1)
  ctx.fillRect(x -  3, cy,      3,  3)           // left claw
  ctx.fillRect(x + 20, cy,      3,  3)           // right claw
  ctx.fillRect(x +  4, y + 2,   2,  2)           // left eye
  ctx.fillRect(x + 14, y + 2,   2,  2)           // right eye
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const acRef     = useRef<AudioContext | null>(null)

  // All mutable game state in refs — the RAF loop reads/writes them directly
  const statusR    = useRef<'idle' | 'playing' | 'dead'>('idle')
  const scoreR     = useRef(0)
  const pyR        = useRef(GY - PH)
  const vyR        = useRef(0)
  const jumpingR   = useRef(false)
  const aFrameR    = useRef(0)
  const aTimerR    = useRef(0)
  const obstaclesR = useRef<{ x: number; w: number }[]>([])
  const spawnTR    = useRef(0)
  const speedR     = useRef(3)
  const hiR           = useRef(0)
  const sessionNameR  = useRef<string | null>(null)  // set after first name entry

  // React state — only for overlay UI
  const [ui,   setUi]  = useState<'idle' | 'playing' | 'dead'>('idle')
  const [dead, setDead] = useState(0)
  const [lb,   setLb]  = useState<LBEntry[]>([])
  const [name, setName] = useState('')
  const [pb,   setPb]  = useState(0)   // session personal best

  // Load leaderboard on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('mk_runner_lb')
      if (raw) {
        const parsed = JSON.parse(raw) as LBEntry[]
        setLb(parsed)
        hiR.current = parsed[0]?.score ?? 0
      }
    } catch {}
  }, [])

  // Reset all ref-based state to idle
  const reset = useCallback(() => {
    statusR.current    = 'idle'
    scoreR.current     = 0
    pyR.current        = GY - PH
    vyR.current        = 0
    jumpingR.current   = false
    aFrameR.current    = 0
    aTimerR.current    = 0
    obstaclesR.current = []
    spawnTR.current    = 0
    speedR.current     = 3
    setUi('idle')
  }, [])

  // Write to localStorage — only upserts if score beats existing entry for that name
  const persistScore = useCallback((n: string, s: number) => {
    try {
      const raw = localStorage.getItem('mk_runner_lb')
      const entries: LBEntry[] = raw ? JSON.parse(raw) : []
      const idx = entries.findIndex(e => e.name === n)
      if (idx >= 0) {
        if (s > entries[idx].score) entries[idx].score = s
        else return  // didn't beat PB — don't touch leaderboard
      } else {
        entries.push({ name: n, score: s })
      }
      entries.sort((a, b) => b.score - a.score)
      const top5 = entries.slice(0, 5)
      localStorage.setItem('mk_runner_lb', JSON.stringify(top5))
      hiR.current = top5[0]?.score ?? 0
      setLb(top5)
    } catch {}
  }, [])

  // First save: record name for the session and persist score
  const save = useCallback(() => {
    const n = name.trim() || 'Anon'
    sessionNameR.current = n
    setPb(dead)
    persistScore(n, dead)
    setName('')
    reset()
  }, [name, dead, persistScore, reset])

  // Returning player: auto-persist if they beat their session PB
  useEffect(() => {
    if (ui !== 'dead' || !sessionNameR.current) return
    if (dead > pb) {
      persistScore(sessionNameR.current, dead)
      setPb(dead)
    }
  }, [ui, dead, pb, persistScore])

  // Jump / start
  const jump = useCallback(() => {
    if (statusR.current === 'idle') {
      statusR.current = 'playing'
      setUi('playing')
    }
    if (statusR.current === 'playing' && !jumpingR.current) {
      vyR.current      = JUMP_V
      jumpingR.current = true
      if (!acRef.current) {
        acRef.current = new (
          window.AudioContext ?? (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!
        )()
      }
      pip(acRef.current)
    }
  }, [])

  // Space-bar listener
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); jump() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  // Main RAF loop — runs once on mount, reads refs each tick
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const loop = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) { rafRef.current = requestAnimationFrame(loop); return }

      const dark = document.documentElement.classList.contains('dark')
      const c    = theme(dark)
      const cf   = Math.floor(Date.now() / 300) % 2  // crab claw frame

      ctx.clearRect(0, 0, CW, CH)

      // Ground line
      ctx.fillStyle = c.ground
      ctx.fillRect(0, GY, CW, 1)

      // ── IDLE ───────────────────────────────────────────────────────────────
      if (statusR.current === 'idle') {
        drawPlayer(ctx, PX, GY - PH, 0, false, c.ink)
        ctx.fillStyle   = c.muted
        ctx.font        = '11px "DM Sans", monospace'
        ctx.textAlign   = 'center'
        ctx.fillText('Press Space to Start', CW / 2, CH - 8)
        if (hiR.current > 0) {
          ctx.fillStyle  = c.amber
          ctx.font       = '10px "Courier New", monospace'
          ctx.textAlign  = 'right'
          ctx.fillText(`HI ${hiR.current}`, CW - 8, 16)
        }

      // ── PLAYING ────────────────────────────────────────────────────────────
      } else if (statusR.current === 'playing') {
        // Physics
        vyR.current += GRAVITY
        pyR.current += vyR.current
        const floor = GY - PH
        if (pyR.current >= floor) {
          pyR.current   = floor
          vyR.current   = 0
          jumpingR.current = false
        }

        // Speed ramp (every 400 points)
        speedR.current = 3 + Math.floor(scoreR.current / 400) * 0.5

        // Obstacle spawn
        spawnTR.current++
        const interval = Math.max(52, 105 - Math.floor(scoreR.current / 200) * 4)
        if (spawnTR.current >= interval) {
          spawnTR.current = 0
          obstaclesR.current.push({ x: CW + 10, w: 18 + Math.floor(Math.random() * 10) })
        }
        for (const o of obstaclesR.current) o.x -= speedR.current
        obstaclesR.current = obstaclesR.current.filter(o => o.x > -50)

        // Leg animation (toggle every 8 ticks)
        if (++aTimerR.current >= 8) { aTimerR.current = 0; aFrameR.current ^= 1 }

        // Score tick
        scoreR.current++

        // Collision — slightly inset hitboxes for forgiveness
        // Player box: (PX+4, py+3, 10, 24)
        // Crab zone:  (o.x, GY-12, o.w, 12)  — body + claws
        const phx = PX + 4, phy = pyR.current + 3
        const phw = 10,      phh = 24
        for (const o of obstaclesR.current) {
          const hit =
            phx      < o.x + o.w &&
            phx + phw > o.x      &&
            phy      < GY        &&
            phy + phh > GY - 12
          if (hit) {
            statusR.current = 'dead'
            setUi('dead')
            setDead(scoreR.current)
            break
          }
        }

        // Draw
        for (const o of obstaclesR.current) drawCrab(ctx, o.x, GY - 10, cf, c.amber)
        drawPlayer(ctx, PX, pyR.current, aFrameR.current, jumpingR.current, c.ink)

        // HUD
        ctx.font      = '10px "Courier New", monospace'
        ctx.textAlign = 'right'
        ctx.fillStyle = c.amber
        ctx.fillText(`${scoreR.current}`, CW - 8, 16)
        if (hiR.current > 0) {
          ctx.fillStyle = c.muted
          ctx.font      = '9px "Courier New", monospace'
          ctx.fillText(`HI ${Math.max(hiR.current, scoreR.current)}`, CW - 8, 27)
        }

      // ── DEAD — frozen last frame ────────────────────────────────────────────
      } else {
        for (const o of obstaclesR.current) drawCrab(ctx, o.x, GY - 10, cf, c.amber)
        drawPlayer(ctx, PX, pyR.current, aFrameR.current, false, c.ink)
        ctx.font      = '10px "Courier New", monospace'
        ctx.textAlign = 'right'
        ctx.fillStyle = c.amber
        ctx.fillText(`${scoreR.current}`, CW - 8, 16)
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])  // intentionally empty — loop reads all state via refs

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-start select-none">
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        onClick={jump}
        className="cursor-pointer block"
        style={{ imageRendering: 'pixelated' }}
        aria-label="Endless runner mini-game — press Space or tap to jump"
      />

      {ui === 'dead' && (
        <div className="w-[350px] border border-t-0 border-[var(--border-md)] bg-card p-4">
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted">
              Game Over
            </span>
            <span className="font-mono text-xl font-bold text-ink">{dead}</span>
          </div>

          {!sessionNameR.current ? (
            /* ── First run: ask for name ─────────────────────────────────── */
            <div className="flex gap-2 mb-4">
              <input
                autoFocus
                type="text"
                placeholder="Your name"
                maxLength={12}
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && save()}
                className="flex-1 bg-transparent border border-[var(--border-md)] px-3 py-1.5 font-sans text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent"
              />
              <button
                onClick={save}
                className="bg-ink text-cream font-sans text-xs px-4 py-1.5 hover:bg-accent transition-colors duration-200"
              >
                Save
              </button>
            </div>
          ) : (
            /* ── Returning player: show PB comparison + retry ────────────── */
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-xs text-muted">
                {dead > pb
                  ? <span className="text-accent">New personal best!</span>
                  : `PB: ${pb}`}
              </span>
              <button
                autoFocus
                onClick={reset}
                className="bg-ink text-cream font-sans text-xs px-4 py-1.5 hover:bg-accent transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          )}

          {lb.length > 0 && (
            <>
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted mb-2">
                Leaderboard
              </p>
              <div className="space-y-1">
                {lb.map((e, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-mono text-xs text-muted">
                      {i + 1}.&nbsp;{e.name}
                    </span>
                    <span className="font-mono text-xs text-accent">{e.score}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
