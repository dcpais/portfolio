import { motion } from 'framer-motion'

const links = ['About', 'Projects', 'Contact']

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-neutral-950/80 backdrop-blur border-b border-neutral-800"
    >
      <a href="#hero" className="text-lg font-bold tracking-tight text-white">
        dcpais
      </a>
      <nav className="flex gap-6">
        {links.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="text-sm text-neutral-400 hover:text-white transition-colors"
          >
            {link}
          </a>
        ))}
      </nav>
    </motion.header>
  )
}
