import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-32 px-6 max-w-3xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-8"
      >
        About
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-neutral-400 text-lg leading-relaxed"
      >
        Placeholder — add your bio here.
      </motion.p>
    </section>
  )
}
