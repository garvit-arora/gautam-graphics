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
      },
      // New items
      'business-cards': {
        id: 'business-cards',
        name: 'Business Cards',
        category: 'Stationery',
        price: '₹249',
        image: 'https://picsum.photos/seed/businesscards/800/500',
        description: 'Premium matte or glossy visiting cards with custom designs and finishes.',
        features: ['Matte/Glossy', 'Rounded Corners', 'Spot UV', 'Custom Design'],
        sizes: ['3.5x2 in', 'Custom']
      },
      'brochure-printing': {
        id: 'brochure-printing',
        name: 'Brochure Printing',
        category: 'Marketing',
        price: '₹699',
        image: 'https://picsum.photos/seed/brochures/800/500',
        description: 'Tri-fold and bi-fold brochures with high-quality paper and vibrant colors.',
        features: ['Tri-fold/Bi-fold', 'Premium Paper', 'Full Color', 'Custom Sizes'],
        sizes: ['A5', 'A4', 'Letter', 'Custom']
      },
      'sticker-printing': {
        id: 'sticker-printing',
        name: 'Sticker Printing',
        category: 'Stickers',
        price: '₹199',
        image: 'https://picsum.photos/seed/stickers/800/500',
        description: 'Custom vinyl stickers, labels, and decals for branding and packaging.',
        features: ['Waterproof', 'Die-Cut', 'Matte/Glossy', 'Custom Shapes'],
        sizes: ['Small', 'Medium', 'Large', 'Custom']
      },
      'id-card-printing': {
        id: 'id-card-printing',
        name: 'ID Card Printing',
        category: 'Identity',
        price: '₹349',
        image: 'https://picsum.photos/seed/idcards/800/500',
        description: 'PVC ID cards with lanyards and custom branding for schools and offices.',
        features: ['PVC Material', 'Lanyard', 'QR/Barcode', 'Photo & Logo'],
        sizes: ['Standard', 'Custom']
      },
      'diaries-notebooks': {
        id: 'diaries-notebooks',
        name: 'Diaries & Notebooks',
        category: 'Stationery',
        price: '₹499',
        image: 'https://picsum.photos/seed/diaries/800/500',
        description: 'Branded diaries and notebooks ideal for corporate gifting and events.',
        features: ['Custom Branding', 'Premium Paper', 'Elastic Closure', 'Bookmark'],
        sizes: ['A5', 'A4', 'Custom']
      },
      'keychain-printing': {
        id: 'keychain-printing',
        name: 'Keychain Printing',
        category: 'Accessories',
        price: '₹149',
        image: 'https://picsum.photos/seed/keychains/800/500',
        description: 'Custom photo and logo keychains in acrylic, metal, and leather finishes.',
        features: ['Photo/Logo', 'Acrylic/Metal', 'Durable', 'Gift Ready'],
        sizes: ['Standard', 'Custom']
      },
      'cap-printing': {
        id: 'cap-printing',
        name: 'Cap Printing',
        category: 'Apparel',
        price: '₹399',
        image: 'https://picsum.photos/seed/caps/800/500',
        description: 'Branded caps with embroidery or print for teams and promotions.',
        features: ['Embroidery/Print', 'Adjustable', 'Multiple Colors', 'Durable'],
        sizes: ['One Size']
      },
      'tote-bags': {
        id: 'tote-bags',
        name: 'Custom Tote Bags',
        category: 'Bags',
        price: '₹599',
        image: 'https://picsum.photos/seed/totebags/800/500',
        description: 'Eco-friendly printed tote bags perfect for events and brand promos.',
        features: ['Eco-friendly', 'Durable', 'Large Print Area', 'Multiple Colors'],
        sizes: ['Standard', 'Large', 'Custom']
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
        
      </div>
    `

    // Event listeners
    const customizeBtn = main.querySelector('#customize-btn')
    if (customizeBtn) {
      customizeBtn.addEventListener('click', () => {
        Router.navigate(`/design-editor?product=${this.productId}`)
      })
    }

    // Enquiry button and modal removed per request

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

    // Hover zoom/parallax on main image
    const imgWrapper = document.querySelector('.product-image-wrapper')
    const img = document.querySelector('.product-detail-image')
    if (imgWrapper && img) {
      imgWrapper.addEventListener('mousemove', (e) => {
        const rect = imgWrapper.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        gsap.to(img, { scale: 1.04, x: (x - 0.5) * 20, y: (y - 0.5) * 20, duration: 0.2 })
      })
      imgWrapper.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, x: 0, y: 0, duration: 0.3, ease: 'power2.out' })
      })
    }
  }
}

