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
      <div class="store-container">
        <div class="store-header">
          <h1 class="store-title">Shop Printing & Design Products</h1>
          <div class="store-actions">
            <a href="/design-editor" class="design-link" data-link>
              <span>🎨</span> Design Studio
            </a>
          </div>
        </div>

        <div class="products-listing">
          <div class="products-header">
            <h2>All Products</h2>
            <span class="product-count">${this.products.length} items</span>
          </div>
          
          <div class="products-grid" id="products-grid">
            ${this.products.map(product => `
              <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                  <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                  <div class="product-badge">${product.category}</div>
                </div>
                <div class="product-details">
                  <h3 class="product-title">${product.name}</h3>
                  <div class="product-rating">
                    <span class="stars">★★★★★</span>
                    <span class="rating-count">(127)</span>
                  </div>
                  <div class="product-price-section">
                    <span class="product-price">${product.price}</span>
                    <span class="price-label">Starting price</span>
                  </div>
                  <p class="product-description">${product.description}</p>
                  <div class="product-features">
                    <span class="feature-tag">✓ Premium Quality</span>
                    <span class="feature-tag">✓ Fast Delivery</span>
                  </div>
                  <div class="product-actions">
                    ${Auth.isAuthenticated() 
                      ? `<button class="btn-add-to-cart" data-product-id="${product.id}">Add to Cart</button>`
                      : `<a href="/login" class="btn-add-to-cart" data-link>Sign in to purchase</a>`
                    }
                    <button class="btn-quick-view" data-product-id="${product.id}">Quick View</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="store-features">
          <div class="feature-item">
            <div class="feature-icon">🚚</div>
            <div class="feature-content">
              <strong>Free Delivery</strong>
              <span>On orders over ₹500</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">↩️</div>
            <div class="feature-content">
              <strong>Easy Returns</strong>
              <span>30-day return policy</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <div class="feature-content">
              <strong>Secure Payment</strong>
              <span>100% secure checkout</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⭐</div>
            <div class="feature-content">
              <strong>Quality Guarantee</strong>
              <span>Premium materials</span>
            </div>
          </div>
        </div>
      </div>
    `

    container.appendChild(main)

    // Add event listeners
    main.querySelectorAll('.btn-quick-view[data-product-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const productId = e.currentTarget.getAttribute('data-product-id')
        Router.navigate(`/product/${productId}`)
      })
    })

    main.querySelectorAll('.btn-add-to-cart[data-product-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const productId = e.currentTarget.getAttribute('data-product-id')
        this.addToCart(productId)
      })
    })

    main.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-add-to-cart') && !e.target.closest('.btn-quick-view')) {
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
    
    // Simple fade in for products
    const productCards = document.querySelectorAll('.product-card')
    productCards.forEach((card, index) => {
      card.style.opacity = '1'
      card.style.visibility = 'visible'
      gsap.fromTo(card,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay: index * 0.05, ease: 'power2.out' }
      )
    })
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
    const btn = document.querySelector(`[data-product-id="${productId}"].btn-add-to-cart`)
    if (btn) {
      const originalText = btn.textContent
      btn.textContent = '✓ Added to Cart'
      btn.style.background = '#10b981'
      setTimeout(() => {
        btn.textContent = originalText
        btn.style.background = ''
      }, 2000)
    }
  }
}

