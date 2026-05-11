interface ExperienceEntry {
  period: string
  badge?: string
  role: string
  org: string
  description: string
}

const experiences: ExperienceEntry[] = [
  {
    period: 'May 2026 – Present',
    badge: 'Current',
    role: 'AI Engineer',
    org: 'Presto Phoenix, Inc. · Internship',
    description:
      'Developing and optimizing real-time voice AI/ML components and LLM-based systems.',
  },
  {
    period: 'Jun – Sep 2024',
    role: 'Research Assistant',
    org: 'University of Waterloo · Dr. Freda Shi',
    description:
      'Built multilingual web app collecting grammatical gender data from 1,000+ participants across 8 languages. Applied CNNs with PyTorch/CUDA for AI visual feature extraction.',
  },
  {
    period: 'Jul – Sep 2023',
    role: 'Software Engineering Intern',
    org: 'National University of Science & Technology',
    description:
      'Designed ESP32-based water monitoring system in C/C++. Achieved 50% improvement in sensor accuracy through systematic model evaluation.',
  },
]

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]"
    >
      <p className="section-label">Background</p>
      <h2 className="section-title">Where I&apos;ve worked</h2>

      <div>
        {experiences.map((entry, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-10 py-8 border-t border-[var(--border)] first:border-t-0"
          >
            <div>
              <p className="font-sans text-sm text-muted">{entry.period}</p>
              {entry.badge && (
                <span className="inline-block mt-2 font-sans text-xs text-accent border border-accent px-2 py-0.5">
                  {entry.badge}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-ink tracking-tight mb-1">
                {entry.role}
              </h3>
              <p className="font-sans text-sm text-accent mb-3">{entry.org}</p>
              <p className="font-sans font-light text-muted text-sm leading-relaxed">
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
