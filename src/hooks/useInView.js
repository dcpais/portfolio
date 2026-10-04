import { useEffect, useRef, useState } from 'react'

export function useInView(threshold = 0.15) {
  const elementRef = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return [elementRef, inView]
}
