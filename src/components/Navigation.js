import { Auth } from '../utils/auth.js'
import { Router } from '../utils/router.js'
import { gsap } from 'gsap'

export class Navigation {
  constructor() {
    this.nav = null
  }

  render() {
    const nav = document.createElement('nav')
    nav.className = 'main-nav'
    nav.innerHTML = `
      <div class="nav-container">
        <div class="nav-brand">
          <a href="/" data-link class="brand-link">
            <span class="brand-icon">🎨</span>
            <span class="brand-text">Gautam Graphics</span>
          </a>
        </div>
        <ul class="nav-links">
          <li><a href="/" data-link class="nav-link">Store</a></li>
          <li><a href="/design-editor" data-link class="nav-link">Design Studio</a></li>
          <li><a href="/location" data-link class="nav-link">Location</a></li>
          <li><a href="/cart" data-link class="nav-link">Cart</a></li>
        </ul>
        <div class="auth-buttons">
          ${Auth.isAuthenticated() 
            ? `<span class="user-name">Welcome, ${Auth.currentUser.name}</span>
               <button class="btn-secondary" data-action="logout">Logout</button>`
            : `<a href="/login" class="btn-secondary" data-link>Login</a>
               <a href="/signup" class="btn-primary" data-link>Sign Up</a>`
          }
        </div>
        <button class="mobile-menu-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    `

    // Add event listeners
    const logoutBtn = nav.querySelector('[data-action="logout"]')
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        Auth.logout()
        Router.navigate('/')
      })
    }

    // Mobile menu toggle
    const mobileToggle = nav.querySelector('.mobile-menu-toggle')
    const navLinks = nav.querySelector('.nav-links')
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active')
      mobileToggle.classList.toggle('active')
    })

    this.nav = nav
    return nav
  }

  onMount() {
    if (this.nav) {
      gsap.from(this.nav.querySelectorAll('.nav-link, .auth-buttons > *'), {
        opacity: 0,
        y: -20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      })
    }
    // Update auth UI after navigation renders
    setTimeout(() => {
      Auth.updateUI()
    }, 100)
  }
}

