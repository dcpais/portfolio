import { motion } from 'framer-motion'

const projects = [
  {
    title: 'Project One',
    description: 'Short description of what this project does.',
    tags: ['React', 'Node.js'],
    href: '#',
  },
  {
    title: 'Project Two',
    description: 'Short description of what this project does.',
    tags: ['Python', 'FastAPI'],
    href: '#',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-white mb-12"
      >
        Projects
      </motion.h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group block p-6 rounded-2xl border border-neutral-800 hover:border-neutral-600 bg-neutral-900 hover:bg-neutral-800/60 transition-colors"
          >
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white">
              {project.title}
            </h3>
            <p className="text-neutral-400 text-sm mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
