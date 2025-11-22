import { gsap } from 'gsap'

export class BackgroundEffects {
  static init() {
    // Create floating orbs
    this.createFloatingOrbs()
    
    // Create grid pattern
    this.createGridPattern()
  }

  static createFloatingOrbs() {
    try {
      const container = document.body
      if (!container) return
      
      // Create 3 floating orbs
      for (let i = 0; i < 3; i++) {
        const orb = document.createElement('div')
        orb.className = 'floating-orb'
        orb.style.cssText = `
          position: fixed;
          width: ${300 + i * 100}px;
          height: ${300 + i * 100}px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(${129 + i * 20}, ${140 - i * 10}, ${248 - i * 20}, 0.1) 0%, 
            transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(40px);
        `
        container.appendChild(orb)
        
        // Animate orb
        if (typeof gsap !== 'undefined') {
          const x = Math.random() * (window.innerWidth || 1000)
          const y = Math.random() * (window.innerHeight || 800)
          
          gsap.set(orb, { x, y })
          
          gsap.to(orb, {
            x: `+=${(Math.random() - 0.5) * 200}`,
            y: `+=${(Math.random() - 0.5) * 200}`,
            duration: 20 + Math.random() * 10,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
          })
        }
      }
    } catch (error) {
      console.warn('Error creating floating orbs:', error)
    }
  }

  static createGridPattern() {
    // Grid is already in CSS, but we can enhance it
    const style = document.createElement('style')
    style.textContent = `
      @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
      }
      
      body::after {
        animation: gridMove 20s linear infinite;
      }
    `
    document.head.appendChild(style)
  }
}

