export default function Contact() {
  return (
    <>
      <section
        id="contact"
        className="py-24 px-6"
        style={{ backgroundColor: 'var(--contact-bg)' }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-sans uppercase tracking-[0.18em] text-accent mb-6">
            Let&apos;s connect
          </p>
          <h2
            className="font-display font-black text-[clamp(36px,6vw,46px)] leading-tight mb-4"
            style={{ letterSpacing: '-1px', color: 'var(--contact-fg)' }}
          >
            Let&apos;s build
            <br />
            <span className="font-display font-light italic text-accent">something great.</span>
          </h2>
          <p
            className="font-sans font-light text-sm mb-10 max-w-md"
            style={{ color: 'var(--light)' }}
          >
            Open to co-op opportunities, interesting projects, and good conversations.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:mm29khan@uwaterloo.ca"
              className="font-sans text-sm font-normal px-6 py-3 hover:bg-accent transition-colors duration-200"
              style={{
                backgroundColor: 'var(--contact-fg)',
                color: 'var(--contact-bg)',
              }}
            >
              mm29khan@uwaterloo.ca
            </a>
            <a
              href="https://linkedin.com/in/moosa-khan-91488b25b/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-normal px-6 py-3 transition-colors duration-200"
              style={{
                border: '1px solid rgba(247,244,238,0.2)',
                color: 'var(--contact-fg)',
              }}
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/moosakhan2"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-normal px-6 py-3 transition-colors duration-200"
              style={{
                border: '1px solid rgba(247,244,238,0.2)',
                color: 'var(--contact-fg)',
              }}
            >
              GitHub ↗
            </a>
            <a
              href="https://leetcode.com/u/Moosa__Khan/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-normal px-6 py-3 transition-colors duration-200"
              style={{
                border: '1px solid rgba(247,244,238,0.2)',
                color: 'var(--contact-fg)',
              }}
            >
              LeetCode ↗
            </a>
          </div>
        </div>
      </section>

      <footer
        className="py-6 px-6"
        style={{
          backgroundColor: 'var(--contact-bg)',
          borderTop: '1px solid rgba(247,244,238,0.08)',
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="font-sans text-xs" style={{ color: 'var(--light)' }}>
            © 2026 Moosa Khan
          </span>
          <span className="font-sans text-xs" style={{ color: 'var(--light)' }}>
            Waterloo, ON
          </span>
        </div>
      </footer>
    </>
  )
}
