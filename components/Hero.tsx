'use client'

import { useState, useEffect } from 'react'
import MiniGame from './MiniGame'

const roles = [
  'AI Engineer @ Presto',
  'Software Engineer',
  'Full-Stack Dev',
  'ML Builder',
  "UWaterloo SE '30",
  'Builder of things',
]

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length)
        setVisible(true)
      }, 300)
    }, 2600)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="pt-24 pb-24 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">

        {/* ── Left: text content ────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-sans uppercase tracking-[0.18em] text-accent mb-8">
            University of Waterloo · Software Engineering
          </p>

          <h1
            className="font-display font-black text-[clamp(54px,8vw,76px)] leading-none text-ink mb-6"
            style={{ letterSpacing: '-3px' }}
          >
            Moosa
            <br />
            <span className="font-display font-light italic text-accent">Khan.</span>
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-accent font-sans text-xl leading-none">—</span>
            <span
              className="font-sans text-lg text-ink"
              style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }}
            >
              {roles[roleIndex]}
            </span>
          </div>

          <p className="font-sans font-light text-muted leading-relaxed mb-10 max-w-[430px]">
            Building things at the intersection of AI and product — currently engineering real-time
            voice AI at Presto. Seeking Winter 2027 co-ops where I can ship fast and learn faster.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:mm29khan@uwaterloo.ca"
              className="bg-ink text-cream font-sans text-sm font-normal px-6 py-3 hover:bg-accent transition-colors duration-200"
            >
              Get in touch
            </a>
            <a
              href="#projects"
              className="border border-ink text-ink font-sans text-sm font-normal px-6 py-3 hover:border-accent hover:text-accent transition-colors duration-200"
            >
              See my work
            </a>
            <a
              href="https://linkedin.com/in/moosa-khan-91488b25b/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-muted hover:text-accent transition-colors duration-200"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/moosakhan2"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-muted hover:text-accent transition-colors duration-200"
            >
              GitHub ↗
            </a>
            <a
              href="https://leetcode.com/u/Moosa__Khan/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-muted hover:text-accent transition-colors duration-200"
            >
              LeetCode ↗
            </a>
          </div>
        </div>

        {/* ── Right: mini-game ──────────────────────────────────────────── */}
        <div className="flex-shrink-0">
          <MiniGame />
        </div>

      </div>
    </section>
  )
}
