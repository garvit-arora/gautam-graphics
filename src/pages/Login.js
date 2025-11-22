import { Navigation } from '../components/Navigation.js'
import { Auth } from '../utils/auth.js'
import { Router } from '../utils/router.js'
import { gsap } from 'gsap'

export class Login {
  render() {
    const container = document.createElement('div')
    container.className = 'auth-page'
    
    const nav = new Navigation()
    container.appendChild(nav.render())

    const main = document.createElement('main')
    main.className = 'auth-main'
    main.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Sign in to continue your design journey</p>
          </div>
          <form class="auth-form" id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="your@email.com">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required placeholder="••••••••">
            </div>
            <div class="form-error" id="form-error"></div>
            <button type="submit" class="btn-primary btn-full">Sign In</button>
            <p class="auth-footer">
              Don't have an account? <a href="/signup" data-link>Sign up</a>
            </p>
          </form>
        </div>
        <div class="auth-visual">
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
      </div>
    `

    const form = main.querySelector('#login-form')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const email = form.email.value
      const password = form.password.value
      const errorDiv = main.querySelector('#form-error')

      const result = Auth.login(email, password)
      if (result.success) {
        Router.navigate('/')
      } else {
        errorDiv.textContent = result.error
        errorDiv.style.display = 'block'
        gsap.from(errorDiv, {
          opacity: 0,
          y: -10,
          duration: 0.3
        })
      }
    })

    container.appendChild(main)
    return container
  }

  onMount() {
    gsap.from('.auth-card', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    })

    gsap.from('.form-group', {
      opacity: 0,
      x: -20,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.2,
      ease: 'power2.out'
    })

    // Animate floating shapes
    const shapes = document.querySelectorAll('.shape')
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        y: `+=${30 + i * 10}`,
        x: `+=${20 - i * 5}`,
        rotation: 360,
        duration: 3 + i,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    })
  }
}

