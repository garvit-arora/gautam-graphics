import { Navigation } from '../components/Navigation.js'
import { Auth } from '../utils/auth.js'
import { Router } from '../utils/router.js'
import { gsap } from 'gsap'

export class Store {
  constructor() {
    this.products = [
      {
        id: 'mug-design',
        name: 'Custom Mug Design',
        category: 'Mugs',
        price: '₹299',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
        description: 'Personalized ceramic mugs with your custom designs'
      },
      {
        id: 'tshirt-design',
        name: 'Custom T-Shirt Design',
        category: 'T-Shirts',
        price: '₹599',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        description: 'Premium quality t-shirts with vibrant prints'
      },
      {
        id: 'wedding-cards',
        name: 'Wedding Invitation Cards',
        category: 'Wedding Cards',
        price: '₹899',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500',
        description: 'Elegant wedding cards with premium finishes'
      },
      {
        id: 'letterhead',
        name: 'Business Letterheads',
        category: 'Letterheads',
        price: '₹499',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500',
        description: 'Professional letterheads for your business'
      },
      {
        id: 'poster',
        name: 'Poster Printing',
        category: 'Posters',
        price: '₹399',
        image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=500',
        description: 'High-quality poster printing services'
      },
      {
        id: 'banner',
        name: 'Banner Printing',
        category: 'Banners',
        price: '₹1299',
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=500',
        description: 'Large format banner printing'
      }
    ]
  }

  render() {
    const container = document.createElement('div')
    container.className = 'store-page'
    container.style.opacity = '1'
    container.style.visibility = 'visible'
    container.style.position = 'relative'
    container.style.zIndex = '1'
    
    const nav = new Navigation()
    container.appendChild(nav.render())

    const main = document.createElement('main')
    main.className = 'store-main'
    main.style.opacity = '1'
    main.style.visibility = 'visible'
    main.style.position = 'relative'
    main.style.zIndex = '1'
    main.innerHTML = `
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="title-line">Premium Printing</span>
            <span class="title-line">& Design Solutions</span>
          </h1>
          <p class="hero-subtitle">Transform your ideas into stunning printed products</p>
          <div class="hero-cta">
            <a href="/design-editor" class="btn-primary btn-large" data-link>
              Start Designing
            </a>
            <a href="/location" class="btn-secondary btn-large" data-link>
              Visit Us
            </a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="printing-animation">
            <div class="printer-machine">
              <div class="paper-roll"></div>
              <div class="paper-output"></div>
              <div class="ink-cartridge"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="products-section">
        <div class="section-header">
          <h2 class="section-title">Our Products</h2>
          <p class="section-subtitle">Explore our wide range of printing services</p>
        </div>
        <div class="products-grid" id="products-grid">
          ${this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
              <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                <div class="product-overlay">
                  <button class="btn-view" data-product-id="${product.id}">View Details</button>
                </div>
              </div>
              <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                  <span class="product-price">${product.price}</span>
                  ${Auth.isAuthenticated() 
                    ? `<button class="btn-add-cart" data-product-id="${product.id}">Add to Cart</button>`
                    : `<a href="/login" class="btn-add-cart" data-link>Login to Buy</a>`
                  }
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="features-section">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Custom Design</h3>
            <p>Create unique designs with our advanced design studio</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Quick turnaround times for all your printing needs</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">✨</div>
            <h3>Premium Quality</h3>
            <p>High-quality materials and printing techniques</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏆</div>
            <h3>Expert Team</h3>
            <p>Experienced designers and printers at your service</p>
          </div>
        </div>
      </section>
    `

    container.appendChild(main)

    // Add event listeners
    main.querySelectorAll('.btn-view[data-product-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.currentTarget.getAttribute('data-product-id')
        Router.navigate(`/product/${productId}`)
      })
    })

    main.querySelectorAll('.btn-add-cart[data-product-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const productId = e.currentTarget.getAttribute('data-product-id')
        this.addToCart(productId)
      })
    })

    main.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-view') && !e.target.closest('.btn-add-cart')) {
          const productId = card.getAttribute('data-product-id')
          Router.navigate(`/product/${productId}`)
        }
      })
    })

    return container
  }

  onMount() {
    // Update auth UI
    Auth.updateUI()
    
    // Ensure all elements are visible first
    const heroTitle = document.querySelector('.hero-title')
    const titleLines = document.querySelectorAll('.hero-title .title-line')
    const heroSubtitle = document.querySelector('.hero-subtitle')
    const heroCta = document.querySelector('.hero-cta')
    const productCards = document.querySelectorAll('.product-card')
    const featureCards = document.querySelectorAll('.feature-card')
    
    if (heroTitle) {
      heroTitle.style.opacity = '1'
      heroTitle.style.visibility = 'visible'
    }
    
    // Ensure title lines are visible with gradient
    titleLines.forEach(line => {
      line.style.opacity = '1'
      line.style.visibility = 'visible'
      line.style.background = 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #f472b6 100%)'
      line.style.webkitBackgroundClip = 'text'
      line.style.webkitTextFillColor = 'transparent'
      line.style.backgroundClip = 'text'
    })
    if (heroSubtitle) {
      heroSubtitle.style.opacity = '1'
      heroSubtitle.style.visibility = 'visible'
    }
    if (heroCta) {
      heroCta.style.opacity = '1'
      heroCta.style.visibility = 'visible'
    }
    productCards.forEach(card => {
      card.style.opacity = '1'
      card.style.visibility = 'visible'
    })
    featureCards.forEach(card => {
      card.style.opacity = '1'
      card.style.visibility = 'visible'
    })
    
    // Animate hero section - use y only, not opacity for gradient text
    titleLines.forEach((line, index) => {
      line.style.opacity = '1'
      gsap.fromTo(line,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: index * 0.2, ease: 'power3.out' }
      )
    })

    gsap.fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' }
    )

    gsap.fromTo('.hero-cta a',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.6, ease: 'back.out(1.7)' }
    )

    // Animate products
    gsap.fromTo('.product-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.8, ease: 'power2.out' }
    )

    // Animate features
    gsap.fromTo('.feature-card',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, delay: 1, ease: 'back.out(1.7)' }
    )

    // Printing animation
    this.initPrintingAnimation()
  }

  initPrintingAnimation() {
    const paperOutput = document.querySelector('.paper-output')
    if (paperOutput) {
      gsap.to(paperOutput, {
        y: -100,
        duration: 2,
        repeat: -1,
        ease: 'none'
      })
    }
  }

  addToCart(productId) {
    if (!Auth.isAuthenticated()) {
      Router.navigate('/login')
      return
    }

    const product = this.products.find(p => p.id === productId)
    if (!product) return

    const cart = JSON.parse(localStorage.getItem('gautam_graphics_cart') || '[]')
    const existingItem = cart.find(item => item.id === productId)

    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.push({
        ...product,
        quantity: 1
      })
    }

    localStorage.setItem('gautam_graphics_cart', JSON.stringify(cart))
    
    // Show success animation
    const btn = document.querySelector(`[data-product-id="${productId}"].btn-add-cart`)
    if (btn) {
      const originalText = btn.textContent
      btn.textContent = '✓ Added!'
      btn.style.background = 'var(--success)'
      setTimeout(() => {
        btn.textContent = originalText
        btn.style.background = ''
      }, 2000)
    }
  }
}

