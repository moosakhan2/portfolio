import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Projects from '@/components/Projects'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Blog from '@/components/Blog'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Blog />
        <Contact />
      </main>
    </>
  )
}
