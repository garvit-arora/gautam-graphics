import { Navigation } from '../components/Navigation.js'
import { gsap } from 'gsap'

export class Location {
  constructor() {
    this.location = {
      address: 'Sector 16, Rohini',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      pincode: '110089',
      fullAddress: 'Sector 16, Rohini, Delhi - 110089, India',
      coordinates: {
        lat: 28.7041,
        lng: 77.1025
      },
      phone: '+91-11-XXXX-XXXX',
      email: 'info@gautamgraphics.com',
      hours: {
        'Monday - Friday': '9:00 AM - 7:00 PM',
        'Saturday': '10:00 AM - 6:00 PM',
        'Sunday': 'Closed'
      }
    }
  }

  render() {
    const container = document.createElement('div')
    container.className = 'location-page'
    
    const nav = new Navigation()
    container.appendChild(nav.render())

    const main = document.createElement('main')
    main.className = 'location-main'
    main.innerHTML = `
      <section class="location-hero">
        <div class="location-hero-content">
          <h1 class="location-title">Visit Our Store</h1>
          <p class="location-subtitle">We're located in the heart of Rohini, Delhi</p>
        </div>
      </section>

      <section class="location-details">
        <div class="location-container">
          <div class="location-info-card">
            <div class="info-section">
              <div class="info-icon">📍</div>
              <div class="info-content">
                <h3>Address</h3>
                <p>${this.location.fullAddress}</p>
              </div>
            </div>
            
            <div class="info-section">
              <div class="info-icon">📞</div>
              <div class="info-content">
                <h3>Phone</h3>
                <p>${this.location.phone}</p>
              </div>
            </div>
            
            <div class="info-section">
              <div class="info-icon">✉️</div>
              <div class="info-content">
                <h3>Email</h3>
                <p>${this.location.email}</p>
              </div>
            </div>
            
            <div class="info-section">
              <div class="info-icon">🕒</div>
              <div class="info-content">
                <h3>Business Hours</h3>
                ${Object.entries(this.location.hours).map(([day, time]) => `
                  <p><strong>${day}:</strong> ${time}</p>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="map-container">
            <div class="map-placeholder">
              <div class="map-marker">
                <div class="marker-pin"></div>
                <div class="marker-pulse"></div>
              </div>
              <p class="map-note">Sector 16, Rohini, Delhi</p>
              <a href="https://maps.app.goo.gl/GF24DVsik4T8qZGs8" 
                 target="_blank" 
                 class="btn-primary"
                 rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="directions-section">
        <div class="directions-container">
          <h2>How to Reach Us</h2>
          <div class="directions-grid">
            <div class="direction-card">
              <div class="direction-icon">🚇</div>
              <h3>By Metro</h3>
              <p>Nearest Metro Station: Rohini West (Red Line)</p>
              <p>Walk 5 minutes to Sector 16</p>
            </div>
            <div class="direction-card">
              <div class="direction-icon">🚌</div>
              <h3>By Bus</h3>
              <p>Multiple bus routes available</p>
              <p>Get down at Sector 16 bus stop</p>
            </div>
            <div class="direction-card">
              <div class="direction-icon">🚗</div>
              <h3>By Car</h3>
              <p>Parking available nearby</p>
              <p>Easy access from NH-44</p>
            </div>
          </div>
        </div>
      </section>
    `

    container.appendChild(main)
    return container
  }

  onMount() {
    gsap.from('.location-title', {
      opacity: 0,
      y: -30,
      duration: 1,
      ease: 'power3.out'
    })

    gsap.from('.info-section', {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.15,
      delay: 0.3,
      ease: 'power2.out'
    })

    gsap.from('.direction-card', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.5,
      ease: 'power2.out'
    })

    // Animate map marker
    const marker = document.querySelector('.marker-pulse')
    if (marker) {
      gsap.to(marker, {
        scale: 2,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: 'power2.out'
      })
    }
  }
}

