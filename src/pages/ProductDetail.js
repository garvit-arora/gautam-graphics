import { Navigation } from '../components/Navigation.js'
import { Auth } from '../utils/auth.js'
import { Router } from '../utils/router.js'
import { gsap } from 'gsap'

export class ProductDetail {
  constructor() {
    this.productId = null
    this.products = {
      'mug-design': {
        id: 'mug-design',
        name: 'Custom Mug Design',
        category: 'Mugs',
        price: '₹299',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800',
        description: 'Personalized ceramic mugs with your custom designs. High-quality printing that lasts.',
        features: ['11oz Ceramic Mug', 'Dishwasher Safe', 'Full Color Printing', 'Custom Design Support'],
        sizes: ['11oz', '15oz', '20oz']
      },
      'tshirt-design': {
        id: 'tshirt-design',
        name: 'Custom T-Shirt Design',
        category: 'T-Shirts',
        price: '₹599',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        description: 'Premium quality t-shirts with vibrant prints. Comfortable fabric with long-lasting designs.',
        features: ['100% Cotton', 'Premium Printing', 'Multiple Sizes', 'Wash Resistant'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL']
      },
      'wedding-cards': {
        id: 'wedding-cards',
        name: 'Wedding Invitation Cards',
        category: 'Wedding Cards',
        price: '₹899',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
        description: 'Elegant wedding cards with premium finishes. Make your special day memorable.',
        features: ['Premium Paper', 'Multiple Finishes', 'Custom Design', 'Envelope Included'],
        sizes: ['5x7', '6x8', 'Custom']
      },
      'letterhead': {
        id: 'letterhead',
        name: 'Business Letterheads',
        category: 'Letterheads',
        price: '₹499',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
        description: 'Professional letterheads for your business. Premium quality paper with custom branding.',
        features: ['Premium Paper', 'Custom Logo', 'Multiple Colors', 'Bulk Printing'],
        sizes: ['A4', 'Letter', 'Custom']
      },
      'poster': {
        id: 'poster',
        name: 'Poster Printing',
        category: 'Posters',
        price: '₹399',
        image: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800',
        description: 'High-quality poster printing services for events, promotions, and displays.',
        features: ['High Resolution', 'Multiple Sizes', 'UV Resistant', 'Fast Delivery'],
        sizes: ['A3', 'A2', 'A1', 'Custom']
      },
      'banner': {
        id: 'banner',
        name: 'Banner Printing',
        category: 'Banners',
        price: '₹1299',
        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
        description: 'Large format banner printing for events, exhibitions, and outdoor displays.',
        features: ['Weather Resistant', 'Large Sizes', 'Durable Material', 'Eyelets Included'],
        sizes: ['3x6ft', '4x8ft', '6x12ft', 'Custom']
      }
    }
  }

  render() {
    const path = window.location.pathname
    const match = path.match(/\/product\/(.+)/)
    this.productId = match ? match[1] : null
    const product = this.products[this.productId] || this.products['mug-design']

    const container = document.createElement('div')
    container.className = 'product-detail-page'
    
    const nav = new Navigation()
    container.appendChild(nav.render())

    const main = document.createElement('main')
    main.className = 'product-detail-main'
    main.innerHTML = `
      <div class="product-detail-container">
        <div class="product-detail-grid">
          <div class="product-image-section">
            <div class="product-image-wrapper">
              <img src="${product.image}" alt="${product.name}" class="product-detail-image">
              <div class="image-zoom-indicator">Click to zoom</div>
            </div>
            <div class="product-thumbnails">
              <img src="${product.image}" alt="Thumbnail 1" class="thumbnail active">
              <img src="${product.image}" alt="Thumbnail 2" class="thumbnail">
              <img src="${product.image}" alt="Thumbnail 3" class="thumbnail">
            </div>
          </div>
          
          <div class="product-info-section">
            <span class="product-category-badge">${product.category}</span>
            <h1 class="product-detail-title">${product.name}</h1>
            <p class="product-detail-description">${product.description}</p>
            
            <div class="product-price-section">
              <span class="product-detail-price">${product.price}</span>
              <span class="price-note">Starting price</span>
            </div>

            <div class="product-options">
              <div class="option-group">
                <label>Size</label>
                <div class="size-selector">
                  ${product.sizes.map(size => `
                    <button class="size-option" data-size="${size}">${size}</button>
                  `).join('')}
                </div>
              </div>
            </div>

            <div class="product-features">
              <h3>Features</h3>
              <ul class="features-list">
                ${product.features.map(feature => `
                  <li><span class="feature-icon">✓</span> ${feature}</li>
                `).join('')}
              </ul>
            </div>

            <div class="product-actions">
              ${Auth.isAuthenticated() 
                ? `
                  <button class="btn-primary btn-large" id="customize-btn">
                    <span>🎨</span> Customize Design
                  </button>
                  <button class="btn-secondary btn-large" id="enquiry-btn">
                    <span>📧</span> Send Enquiry
                  </button>
                `
                : `
                  <a href="/login" class="btn-primary btn-large" data-link>
                    Login to Customize
                  </a>
                `
              }
            </div>
          </div>
        </div>

        <div class="enquiry-form-modal" id="enquiry-modal">
          <div class="modal-overlay"></div>
          <div class="modal-content">
            <button class="modal-close" id="close-modal">&times;</button>
            <h2>Send Enquiry</h2>
            <form id="enquiry-form">
              <div class="form-group">
                <label for="enquiry-name">Name</label>
                <input type="text" id="enquiry-name" name="name" required>
              </div>
              <div class="form-group">
                <label for="enquiry-email">Email</label>
                <input type="email" id="enquiry-email" name="email" required>
              </div>
              <div class="form-group">
                <label for="enquiry-phone">Phone</label>
                <input type="tel" id="enquiry-phone" name="phone" required>
              </div>
              <div class="form-group">
                <label for="enquiry-quantity">Quantity</label>
                <input type="number" id="enquiry-quantity" name="quantity" min="1" required>
              </div>
              <div class="form-group">
                <label for="enquiry-message">Message</label>
                <textarea id="enquiry-message" name="message" rows="4" placeholder="Any special requirements?"></textarea>
              </div>
              <button type="submit" class="btn-primary btn-full">Send Enquiry</button>
            </form>
          </div>
        </div>
      </div>
    `

    // Event listeners
    const customizeBtn = main.querySelector('#customize-btn')
    if (customizeBtn) {
      customizeBtn.addEventListener('click', () => {
        Router.navigate(`/design-editor?product=${this.productId}`)
      })
    }

    const enquiryBtn = main.querySelector('#enquiry-btn')
    const enquiryModal = main.querySelector('#enquiry-modal')
    const closeModal = main.querySelector('#close-modal')
    
    if (enquiryBtn) {
      enquiryBtn.addEventListener('click', () => {
        enquiryModal.classList.add('active')
        gsap.from('.modal-content', {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
      })
    }

    closeModal.addEventListener('click', () => {
      enquiryModal.classList.remove('active')
    })

    main.querySelector('.modal-overlay').addEventListener('click', () => {
      enquiryModal.classList.remove('active')
    })

    const enquiryForm = main.querySelector('#enquiry-form')
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault()
      alert('Enquiry submitted successfully! We will contact you soon.')
      enquiryModal.classList.remove('active')
      enquiryForm.reset()
    })

    // Size selector
    main.querySelectorAll('.size-option').forEach(btn => {
      btn.addEventListener('click', () => {
        main.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
      })
    })

    container.appendChild(main)
    return container
  }

  onMount() {
    gsap.from('.product-detail-image', {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'power2.out'
    })

    gsap.from('.product-info-section > *', {
      opacity: 0,
      x: 30,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.2,
      ease: 'power2.out'
    })
  }
}

