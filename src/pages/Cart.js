import { Navigation } from '../components/Navigation.js'
import { Router } from '../utils/router.js'
import { Auth } from '../utils/auth.js'
import { gsap } from 'gsap'

export class Cart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('gautam_graphics_cart') || '[]')
  }

  render() {
    const container = document.createElement('div')
    container.className = 'cart-page'
    
    const nav = new Navigation()
    container.appendChild(nav.render())

    const main = document.createElement('main')
    main.className = 'cart-main'
    
    if (!Auth.isAuthenticated()) {
      main.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon">🛒</div>
          <h2>Please login to view your cart</h2>
          <p>Sign in to add items and proceed with your order</p>
          <a href="/login" class="btn-primary" data-link>Login</a>
        </div>
      `
      container.appendChild(main)
      return container
    }

    if (this.cart.length === 0) {
      main.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Start adding products to your cart</p>
          <a href="/" class="btn-primary" data-link>Browse Products</a>
        </div>
      `
    } else {
      const total = this.cart.reduce((sum, item) => sum + (parseInt(item.price.replace('₹', '')) * item.quantity), 0)
      
      main.innerHTML = `
        <div class="cart-container">
          <h1 class="cart-title">Shopping Cart</h1>
          <div class="cart-content">
            <div class="cart-items">
              ${this.cart.map((item, index) => `
                <div class="cart-item" data-item-index="${index}">
                  <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                  <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p class="cart-item-category">${item.category}</p>
                    <div class="cart-item-controls">
                      <div class="quantity-control">
                        <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
                      </div>
                      <span class="cart-item-price">${item.price}</span>
                      <button class="remove-btn" data-action="remove" data-index="${index}">Remove</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="cart-summary">
              <h2>Order Summary</h2>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>₹${total}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>₹99</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>₹${total + 99}</span>
              </div>
              <button class="btn-primary btn-large btn-full" id="checkout-btn">Proceed to Checkout</button>
              <a href="/" class="btn-secondary btn-full" data-link>Continue Shopping</a>
            </div>
          </div>
        </div>
      `
    }

    // Event listeners
    main.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action')
        const index = parseInt(e.currentTarget.getAttribute('data-index'))
        this.handleCartAction(action, index)
      })
    })

    const checkoutBtn = main.querySelector('#checkout-btn')
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Checkout functionality will be integrated with payment gateway')
      })
    }

    container.appendChild(main)
    return container
  }

  handleCartAction(action, index) {
    if (action === 'increase') {
      this.cart[index].quantity++
    } else if (action === 'decrease') {
      if (this.cart[index].quantity > 1) {
        this.cart[index].quantity--
      } else {
        this.cart.splice(index, 1)
      }
    } else if (action === 'remove') {
      this.cart.splice(index, 1)
    }

    localStorage.setItem('gautam_graphics_cart', JSON.stringify(this.cart))
    Router.navigate('/cart')
  }

  onMount() {
    gsap.from('.cart-item', {
      opacity: 0,
      x: -30,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    })

    gsap.from('.cart-summary', {
      opacity: 0,
      x: 30,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out'
    })
  }
}

