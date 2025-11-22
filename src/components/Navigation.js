import { Auth } from '../utils/auth.js'
import { Router } from '../utils/router.js'
import { gsap } from 'gsap'
import logo from "../logo2.png"

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
            <span class="brand-icon"><img src="${logo}" alt="Gautam Graphics Logo" style="width: 40px; height: 40px;"></span>
              
            
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

    // Mobile menu toggle with animation
    const toggle = nav.querySelector('.mobile-menu-toggle')
    const links = nav.querySelector('.nav-links')
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const active = links.classList.toggle('active')
        const bars = toggle.querySelectorAll('span')
        if (active) {
          gsap.to(links, { left: 0, duration: 0.3, ease: 'power2.out' })
          gsap.to(bars[0], { rotate: 45, y: 6, duration: 0.2 })
          gsap.to(bars[1], { opacity: 0, duration: 0.2 })
          gsap.to(bars[2], { rotate: -45, y: -6, duration: 0.2 })
        } else {
          gsap.to(links, { left: '-100%', duration: 0.3, ease: 'power2.in' })
          gsap.to(bars[0], { rotate: 0, y: 0, duration: 0.2 })
          gsap.to(bars[1], { opacity: 1, duration: 0.2 })
          gsap.to(bars[2], { rotate: 0, y: 0, duration: 0.2 })
        }
      })
    }

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

    // Floating cart badge (bottom-right)
    if (!document.getElementById('floating-cart')) {
      const floating = document.createElement('button')
      floating.id = 'floating-cart'
      floating.className = 'floating-cart'
      floating.setAttribute('aria-label', 'Open cart')
      floating.innerHTML = `
        <span class="floating-cart-emoji">🛒</span>
        <span class="floating-cart-count" id="floating-cart-count">0</span>
      `
      document.body.appendChild(floating)
      floating.addEventListener('click', () => {
        Router.navigate('/cart')
      })
    }

    const updateCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('gautam_graphics_cart') || '[]')
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
        const badge = document.getElementById('floating-cart-count')
        const btn = document.getElementById('floating-cart')
        if (badge && btn) {
          badge.textContent = String(count)
          btn.style.display = count > 0 ? 'flex' : 'none'
        }
      } catch (_) {}
    }

    // Initial update and event listener
    updateCount()
    document.addEventListener('cart:updated', () => {
      updateCount()
      const btn = document.getElementById('floating-cart')
      if (btn) {
        btn.classList.remove('pop')
        // trigger pop animation
        void btn.offsetWidth
        btn.classList.add('pop')
        setTimeout(() => btn.classList.remove('pop'), 600)
      }
    })
  }
}

