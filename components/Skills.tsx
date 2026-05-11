const skills = [
  'Python',
  'C / C++',
  'JavaScript',
  'React',
  'Node.js',
  'Next.js',
  'Flask',
  'FastAPI',
  'PyTorch',
  'LangChain',
  'SQL',
  'Firebase',
  'Supabase',
  'Tailwind CSS',
  'NumPy',
  'Figma',
  'Git',
  'Linux / Bash',
  'Voice AI',
  'LLMs',
]

export default function Skills() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      <p className="section-label">Skills &amp; Tools</p>
      <h2 className="section-title">What I work with</h2>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="font-sans text-sm text-muted border border-[var(--border-md)] px-4 py-2 hover:border-accent hover:text-accent transition-colors duration-200 cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  )
}
