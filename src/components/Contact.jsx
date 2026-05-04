import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 max-w-3xl mx-auto text-center">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-4"
      >
        Get in touch
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-neutral-400 mb-8"
      >
        I'm open to new opportunities. Feel free to reach out.
      </motion.p>
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        href="mailto:deeppais08@gmail.com"
        className="inline-block px-8 py-3 rounded-full bg-white text-neutral-950 font-medium text-sm hover:bg-neutral-200 transition-colors"
      >
        Say hello
      </motion.a>
    </section>
  )
}
