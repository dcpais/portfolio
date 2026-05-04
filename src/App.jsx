import Navbar from './components/Navbar'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'

export default function App() {
  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen">
      <Navbar />
      <main>
        <About />
        <Projects />
        <Contact />
      </main>
    </div>
  )
}
