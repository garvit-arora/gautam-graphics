// Import CSS - Vite handles this automatically
import './styles/index.css'
import { Router } from './utils/router.js'
import { Auth } from './utils/auth.js'
import { initLoader } from './utils/loader.js'
import { BackgroundEffects } from './components/BackgroundEffects.js'

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize authentication first
    Auth.init()
    
    // Initialize router (this will load the page and hide loader)
    Router.init()
    
    // Initialize loader animation (after router starts)
    setTimeout(() => {
      initLoader()
    }, 100)
    
    // Initialize background effects (with error handling) - delay to not block rendering
    setTimeout(() => {
      try {
        BackgroundEffects.init()
      } catch (bgError) {
        console.warn('Background effects error:', bgError)
      }
    }, 500)
    
    // Fallback: Hide loader after 2 seconds if still showing
    setTimeout(() => {
      const loader = document.getElementById('loader')
      const app = document.getElementById('app')
      if (loader && loader.style.display !== 'none') {
        loader.style.display = 'none'
        loader.style.opacity = '0'
        loader.style.pointerEvents = 'none'
        loader.style.zIndex = '-1'
        loader.classList.add('hidden')
      }
      // Ensure app is visible
      if (app) {
        app.style.opacity = '1'
        app.style.visibility = 'visible'
        app.style.zIndex = '1'
      }
    }, 2000)
  } catch (error) {
    console.error('Initialization error:', error)
    const app = document.getElementById('app')
    const loader = document.getElementById('loader')
    
    if (loader) {
      loader.style.display = 'none'
      loader.style.opacity = '0'
    }
    
    if (app) {
      app.innerHTML = `
        <div style="padding: 4rem; text-align: center; color: var(--text);">
          <h1>Error Loading Application</h1>
          <p>${error.message}</p>
          <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">Reload Page</button>
        </div>
      `
    }
  }
})

