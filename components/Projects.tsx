'use client'

import { useState } from 'react'

interface Project {
  number: string
  name: string
  tagline: string
  description: string
  stack: string[]
  link: string | null
  tilt: number
}

const projects: Project[] = [
  {
    number: '01',
    name: 'Skribe',
    tagline: 'AI medical intake assistant',
    description:
      'Hackathon project automating medical intake with AI — reducing paperwork and improving patient flow end-to-end.',
    stack: ['AI / NLP', 'React', 'AMD'],
    link: 'https://lablab.ai/ai-hackathons/amd-developer/skribe/skribe-ai-assisted-medical-intake',
    tilt: -1.5,
  },
  {
    number: '02',
    name: 'Lumen AI',
    tagline: 'AI-powered personal tutor',
    description:
      'Real-time voice feedback, digital whiteboard & multimodal RAG pipeline for personalized learning at scale.',
    stack: ['Next.js', 'FastAPI', 'GPT-4o', 'LangChain', 'WebSockets'],
    link: null,
    tilt: 1.5,
  },
  {
    number: '03',
    name: 'CoinUp',
    tagline: 'Digitizing loose change',
    description:
      'Payment platform crediting spare change to digital wallets. 100+ users onboarded in a live pilot.',
    stack: ['React', 'Node.js', 'Firebase', 'Stripe'],
    link: 'https://coinup.ca',
    tilt: -1,
  },
  {
    number: '04',
    name: 'GooseMarket',
    tagline: 'UWaterloo prediction market',
    description:
      'Campus prediction market where students bet on campus events using virtual currency.',
    stack: ['React', 'Flask', 'Supabase', 'PyTest'],
    link: null,
    tilt: 1,
  },
]

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)

  const hasLink = project.link && project.link !== '#'

  return (
    <div
      className="project-card relative bg-card border border-[var(--border)] p-8"
      style={{
        transform: hovered
          ? 'translateY(-5px) rotate(0deg)'
          : `rotate(${project.tilt}deg)`,
        transition: 'transform 0.35s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasLink && (
        <a
          href={project.link!}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10"
          aria-label={`Visit ${project.name}`}
        />
      )}
      <div className="amber-bar" />

      <div className="flex justify-between items-start mb-5">
        <span className="font-display font-light italic text-accent text-sm">
          {project.number}
        </span>
        <span
          className="text-xl leading-none transition-colors duration-200"
          style={{ color: hovered ? 'var(--amber)' : 'var(--light)' }}
        >
          ↗
        </span>
      </div>

      <h3 className="font-display font-black text-2xl text-ink mb-1 tracking-tight">
        {project.name}
      </h3>
      <p className="text-xs font-sans uppercase tracking-[0.12em] text-accent mb-4">
        {project.tagline}
      </p>
      <p className="font-sans font-light text-muted text-sm leading-relaxed mb-6">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="font-sans text-xs text-muted px-2 py-1 border border-[var(--border-md)]"
            style={{ backgroundColor: 'var(--tag-bg)' }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]"
    >
      <p className="section-label">Selected Work</p>
      <h2 className="section-title">Things I&apos;ve built</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <ProjectCard key={project.number} project={project} />
        ))}
      </div>
    </section>
  )
}
