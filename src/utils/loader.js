import { gsap } from 'gsap'

export function initLoader() {
  const loader = document.getElementById('loader')
  const printer = loader.querySelector('.printer')
  const paper = loader.querySelector('.paper')
  const ink = loader.querySelector('.ink')
  const text = loader.querySelector('.loader-text')

  // Animate printer
  gsap.to(printer, {
    y: -10,
    duration: 0.5,
    yoyo: true,
    repeat: -1,
    ease: 'power2.inOut'
  })

  // Animate paper sliding
  gsap.to(paper, {
    y: -30,
    duration: 1,
    yoyo: true,
    repeat: -1,
    ease: 'power1.inOut'
  })

  // Animate ink flow
  gsap.to(ink, {
    scaleY: 1.2,
    duration: 0.8,
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
}

