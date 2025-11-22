import { gsap } from 'gsap'

export function initLoader() {
  const loader = document.getElementById('loader')
  const printer = loader.querySelector('.printer')
  const paper = loader.querySelector('.paper')
  const ink = loader.querySelector('.ink')
  const text = loader.querySelector('.loader-text')

  // Subtle floating printer
  gsap.to(printer, {
    y: -8,
    duration: 0.8,
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut'
  })

  // Paper sliding loop
  gsap.to(paper, {
    y: -28,
    duration: 1.2,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut'
  })

  // Animate ink flow
  gsap.to(ink, {
    scaleY: 1.15,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: 'power2.inOut'
  })

  // Animate text
  gsap.to(text, {
    opacity: 0.5,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut'
  })

  // Entry shimmer on loader container
  gsap.from(loader, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  })
}

