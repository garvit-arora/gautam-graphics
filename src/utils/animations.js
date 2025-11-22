import { gsap } from 'gsap'

export function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target
        const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0')
        const y = parseFloat(el.getAttribute('data-reveal-y') || '20')
        gsap.fromTo(el, { opacity: 0, y }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay })
        observer.unobserve(el)
      }
    })
  }, { threshold: 0.15 })

  const selectors = [
    '.product-card',
    '.feature-item',
    '.direction-card',
    '.info-section',
    '.cart-item',
    '.auth-card',
    '.editor-sidebar',
    '.editor-canvas-area'
  ]

  document.querySelectorAll(selectors.join(',')).forEach(el => observer.observe(el))
}

export function addHoverTiltToCards(selector = '.product-card') {
  const cards = document.querySelectorAll(selector)
  cards.forEach(card => {
    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const rotateY = ((x / rect.width) - 0.5) * 10
      const rotateX = ((y / rect.height) - 0.5) * -10
      gsap.to(card, { rotateY, rotateX, transformPerspective: 800, duration: 0.2 })
    }
    const onLeave = () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.3, ease: 'power2.out' })
    }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
  })
}