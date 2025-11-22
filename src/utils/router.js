import { gsap } from 'gsap'

export class Router {
  static routes = {}
  static currentRoute = null

  static init() {
    // Define all routes
    this.routes = {
      '/': () => import('../pages/Store.js').then(m => m.Store),
      '/login': () => import('../pages/Login.js').then(m => m.Login),
      '/signup': () => import('../pages/Signup.js').then(m => m.Signup),
      '/product/:id': () => import('../pages/ProductDetail.js').then(m => m.ProductDetail),
      '/design-editor': () => import('../pages/DesignEditor.js').then(m => m.DesignEditor),
      '/location': () => import('../pages/Location.js').then(m => m.Location),
      '/cart': () => import('../pages/Cart.js').then(m => m.Cart),
    }

    // Handle navigation
    window.addEventListener('popstate', () => this.handleRoute())
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault()
        this.navigate(e.target.getAttribute('href'))
      }
    })

    // Initial route
    this.handleRoute()
  }

  static navigate(path) {
    window.history.pushState({}, '', path)
    this.handleRoute()
  }

  static async handleRoute() {
    const path = window.location.pathname
    const app = document.getElementById('app')
    
    if (!app) {
      console.error('App element not found')
      return
    }
    
    // Show loader only if not initial load
    const loader = document.getElementById('loader')
    const isInitialLoad = this.currentRoute === null
    
    if (loader && !isInitialLoad) {
      loader.style.display = 'flex'
      loader.style.opacity = '1'
    }
    
    try {
      // Find matching route
      let routeHandler = null
      let params = {}

      for (const [route, handler] of Object.entries(this.routes)) {
        if (route.includes(':')) {
          const routePattern = route.replace(/:[^/]+/g, '([^/]+)')
          const regex = new RegExp(`^${routePattern}$`)
          const match = path.match(regex)
          if (match) {
            routeHandler = handler
            const paramNames = route.match(/:[^/]+/g) || []
            paramNames.forEach((param, i) => {
              params[param.slice(1)] = match[i + 1]
            })
            break
          }
        } else if (route === path) {
          routeHandler = handler
          break
        }
      }

      if (routeHandler) {
        const PageComponent = await routeHandler()
        
        // Hide loader immediately
        if (loader) {
          loader.style.display = 'none'
          loader.style.opacity = '0'
          loader.style.pointerEvents = 'none'
          loader.style.zIndex = '-1'
        }
        
        // Clear app
        app.innerHTML = ''
        
        // Ensure app is visible before adding content
        app.style.opacity = '1'
        app.style.visibility = 'visible'
        app.style.zIndex = '1'
        
        // Create and append page
        const page = new PageComponent()
        const pageElement = page.render()
        app.appendChild(pageElement)
        this.currentRoute = path
        
        // Ensure page element is visible
        if (pageElement) {
          pageElement.style.opacity = '1'
          pageElement.style.visibility = 'visible'
        }
        
        // Small fade in animation
        setTimeout(() => {
          if (app) {
            gsap.fromTo(app, 
              { opacity: 0.9 },
              { 
                opacity: 1,
                duration: 0.2,
                ease: 'power2.out'
              }
            )
          }
        }, 10)
        
        if (page.onMount) {
          setTimeout(() => page.onMount(), 100)
        }
      } else {
        // 404 - redirect to store
        if (loader) {
          loader.style.display = 'none'
        }
        this.navigate('/')
      }
    } catch (error) {
      console.error('Route error:', error)
      if (loader) {
        loader.style.display = 'none'
      }
      // Show error message
      app.innerHTML = `
        <div style="padding: 4rem; text-align: center; color: var(--text);">
          <h1>Error Loading Page</h1>
          <p>${error.message}</p>
          <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">Reload Page</button>
        </div>
      `
    }
  }
}

