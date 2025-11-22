export class Auth {
  static currentUser = null

  static init() {
    // Load user from localStorage
    const userData = localStorage.getItem('gautam_graphics_user')
    if (userData) {
      this.currentUser = JSON.parse(userData)
      this.updateUI()
    }
  }

  static login(email, password) {
    // In a real app, this would be an API call
    // For now, we'll use localStorage
    const users = JSON.parse(localStorage.getItem('gautam_graphics_users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    
    if (user) {
      this.currentUser = { email: user.email, name: user.name }
      localStorage.setItem('gautam_graphics_user', JSON.stringify(this.currentUser))
      this.updateUI()
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  static signup(name, email, password) {
    const users = JSON.parse(localStorage.getItem('gautam_graphics_users') || '[]')
    
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' }
    }

    users.push({ name, email, password })
    localStorage.setItem('gautam_graphics_users', JSON.stringify(users))
    
    this.currentUser = { email, name }
    localStorage.setItem('gautam_graphics_user', JSON.stringify(this.currentUser))
    this.updateUI()
    
    return { success: true }
  }

  static logout() {
    this.currentUser = null
    localStorage.removeItem('gautam_graphics_user')
    this.updateUI()
  }

  static isAuthenticated() {
    return this.currentUser !== null
  }

  static updateUI() {
    // Update navigation based on auth state
    const nav = document.querySelector('nav')
    if (nav) {
      const authButtons = nav.querySelector('.auth-buttons')
      if (authButtons) {
        if (this.isAuthenticated()) {
          authButtons.innerHTML = `
            <span class="user-name">Welcome, ${this.currentUser.name}</span>
            <button class="btn-secondary" data-action="logout">Logout</button>
          `
          authButtons.querySelector('[data-action="logout"]').addEventListener('click', () => {
            this.logout()
            if (window.location.pathname !== '/') {
              window.location.href = '/'
            } else {
              window.location.reload()
            }
          })
        } else {
          authButtons.innerHTML = `
            <a href="/login" class="btn-secondary" data-link>Login</a>
            <a href="/signup" class="btn-primary" data-link>Sign Up</a>
          `
        }
      }
    }
  }
}

