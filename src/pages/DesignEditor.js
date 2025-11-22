import { Navigation } from '../components/Navigation.js'
import { Auth } from '../utils/auth.js'
import { Router } from '../utils/router.js'
import { gsap } from 'gsap'

export class DesignEditor {
  constructor() {
    this.canvas = null
    this.ctx = null
    this.selectedTool = 'select'
    this.elements = []
    this.selectedElement = null
    this.isDragging = false
    this.dragOffset = { x: 0, y: 0 }
    this.productType = 'mug'
    this.canvasSize = { width: 800, height: 600 }
    this.isDrawing = false
    this.lastX = 0
    this.lastY = 0
    this.drawColor = '#000000'
    this.drawWidth = 3
    this.history = []
    this.historyIndex = -1
  }

  render() {
    if (!Auth.isAuthenticated()) {
      const container = document.createElement('div')
      container.className = 'editor-page'
      const nav = new Navigation()
      container.appendChild(nav.render())
      const main = document.createElement('main')
      main.className = 'editor-main'
      main.innerHTML = `
        <div class="auth-required">
          <h2>Please login to use the Design Studio</h2>
          <a href="/login" class="btn-primary" data-link>Login</a>
        </div>
      `
      container.appendChild(main)
      return container
    }

    // Get product type from URL
    const urlParams = new URLSearchParams(window.location.search)
    this.productType = urlParams.get('product') || 'mug'

    const container = document.createElement('div')
    container.className = 'editor-page'
    
    const nav = new Navigation()
    container.appendChild(nav.render())

    const main = document.createElement('main')
    main.className = 'editor-main'
    main.innerHTML = `
      <div class="editor-container">
        <div class="editor-sidebar">
          <div class="sidebar-section">
            <h3>Tools</h3>
            <div class="tool-buttons">
              <button class="tool-btn ${this.selectedTool === 'select' ? 'active' : ''}" data-tool="select">
                <span>👆</span> Select
              </button>
              <button class="tool-btn" data-tool="text">
                <span>📝</span> Text
              </button>
              <button class="tool-btn" data-tool="shape">
                <span>⬜</span> Shape
              </button>
              <button class="tool-btn" data-tool="image">
                <span>🖼️</span> Image
              </button>
              <button class="tool-btn" data-tool="draw">
                <span>✏️</span> Draw
              </button>
            </div>
          </div>

          <div class="sidebar-section" id="text-panel" style="display: none;">
            <h3>Text Properties</h3>
            <input type="text" id="text-input" placeholder="Enter text" class="text-input">
            <input type="color" id="text-color" value="#000000" class="color-input">
            <select id="text-font" class="font-select">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
            <input type="range" id="text-size" min="12" max="72" value="24" class="size-slider">
            <span class="size-value">Size: <span id="size-display">24</span>px</span>
          </div>

          <div class="sidebar-section" id="shape-panel" style="display: none;">
            <h3>Shapes</h3>
            <div class="shape-buttons">
              <button class="shape-btn" data-shape="rect">⬜ Rectangle</button>
              <button class="shape-btn" data-shape="circle">⭕ Circle</button>
              <button class="shape-btn" data-shape="line">➖ Line</button>
            </div>
            <input type="color" id="shape-color" value="#FF0000" class="color-input">
          </div>

          <div class="sidebar-section" id="image-panel" style="display: none;">
            <h3>Upload Image</h3>
            <input type="file" id="image-upload" accept="image/*" class="file-input">
            <p class="help-text">Upload your own image</p>
          </div>

          <div class="sidebar-section" id="draw-panel" style="display: none;">
            <h3>Draw Properties</h3>
            <input type="color" id="draw-color" value="#000000" class="color-input">
            <label>Brush Size</label>
            <input type="range" id="draw-width" min="1" max="20" value="3" class="size-slider">
            <span class="size-value">Size: <span id="draw-size-display">3</span>px</span>
          </div>

          <div class="sidebar-section">
            <h3>Templates</h3>
            <div class="template-buttons">
              <button class="template-btn" data-template="mug">☕ Mug</button>
              <button class="template-btn" data-template="tshirt">👕 T-Shirt</button>
              <button class="template-btn" data-template="card">💌 Card</button>
              <button class="template-btn" data-template="letterhead">📄 Letterhead</button>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>Actions</h3>
            <button class="btn-secondary btn-full" id="clear-btn">Clear Canvas</button>
            <button class="btn-primary btn-full" id="save-btn">Save Design</button>
            <button class="btn-primary btn-full" id="export-btn">Export & Order</button>
          </div>
        </div>

        <div class="editor-canvas-area">
          <div class="canvas-toolbar">
            <div class="canvas-info">
              <span>Design Studio</span>
              <span class="product-badge">${this.productType}</span>
            </div>
            <div class="canvas-actions">
              <button class="btn-icon" id="undo-btn" title="Undo">↶</button>
              <button class="btn-icon" id="redo-btn" title="Redo">↷</button>
              <button class="btn-icon" id="zoom-out" title="Zoom Out">-</button>
              <span class="zoom-level">100%</span>
              <button class="btn-icon" id="zoom-in" title="Zoom In">+</button>
            </div>
          </div>
          <div class="canvas-wrapper">
            <canvas id="design-canvas" width="800" height="600"></canvas>
            <div class="canvas-overlay" id="canvas-overlay"></div>
          </div>
        </div>
      </div>
    `

    container.appendChild(main)
    return container
  }

  onMount() {
    this.canvas = document.getElementById('design-canvas')
    this.ctx = this.canvas.getContext('2d')
    this.setupCanvas()
    this.setupEventListeners()
    this.loadTemplate(this.productType)
    
    // Animate editor entrance
    gsap.from('.editor-sidebar', {
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: 'power2.out'
    })

    gsap.from('.editor-canvas-area', {
      opacity: 0,
      x: 30,
      duration: 0.6,
      ease: 'power2.out'
    })
  }

  setupCanvas() {
    // Set canvas background
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Draw product template outline
    this.drawProductTemplate()
    
    // Initialize history
    this.saveState()
  }

  drawProductTemplate() {
    this.ctx.strokeStyle = '#e0e0e0'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([5, 5])

    switch (this.productType) {
      case 'mug':
        // Mug shape
        this.ctx.beginPath()
        this.ctx.arc(400, 300, 150, 0, Math.PI * 2)
        this.ctx.stroke()
        break
      case 'tshirt':
        // T-shirt shape
        this.ctx.beginPath()
        this.ctx.rect(200, 100, 400, 400)
        this.ctx.stroke()
        break
      case 'card':
        // Card shape
        this.ctx.beginPath()
        this.ctx.rect(150, 50, 500, 500)
        this.ctx.stroke()
        break
      case 'letterhead':
        // Letterhead shape
        this.ctx.beginPath()
        this.ctx.rect(50, 50, 700, 500)
        this.ctx.stroke()
        break
    }

    this.ctx.setLineDash([])
  }

  setupEventListeners() {
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = e.currentTarget.getAttribute('data-tool')
        this.selectTool(tool)
      })
    })

    // Text tool
    document.getElementById('text-input').addEventListener('input', (e) => {
      if (this.selectedTool === 'text') {
        this.addText(e.target.value)
      }
    })

    // Canvas click
    this.canvas.addEventListener('click', (e) => {
      this.handleCanvasClick(e)
    })

    // Canvas drag
    this.canvas.addEventListener('mousedown', (e) => {
      if (this.selectedTool === 'draw') {
        this.startDrawing(e)
      } else {
        this.handleMouseDown(e)
      }
    })

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.selectedTool === 'draw' && this.isDrawing) {
        this.draw(e)
      } else {
        this.handleMouseMove(e)
      }
    })

    this.canvas.addEventListener('mouseup', () => {
      if (this.selectedTool === 'draw') {
        this.stopDrawing()
      } else {
        this.handleMouseUp()
      }
    })

    this.canvas.addEventListener('mouseleave', () => {
      if (this.selectedTool === 'draw') {
        this.stopDrawing()
      }
    })

    // Shape buttons
    document.querySelectorAll('.shape-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const shape = e.currentTarget.getAttribute('data-shape')
        this.addShape(shape)
      })
    })

    // Image upload
    document.getElementById('image-upload').addEventListener('change', (e) => {
      this.handleImageUpload(e)
    })

    // Template buttons
    document.querySelectorAll('.template-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const template = e.currentTarget.getAttribute('data-template')
        this.loadTemplate(template)
      })
    })

    // Clear button
    document.getElementById('clear-btn').addEventListener('click', () => {
      if (confirm('Clear all elements?')) {
        this.elements = []
        this.saveState()
        this.redraw()
      }
    })

    // Save button
    document.getElementById('save-btn').addEventListener('click', () => {
      this.saveDesign()
    })

    // Export button
    document.getElementById('export-btn').addEventListener('click', () => {
      this.exportDesign()
    })

    // Undo button
    document.getElementById('undo-btn').addEventListener('click', () => {
      this.undo()
    })

    // Redo button
    document.getElementById('redo-btn').addEventListener('click', () => {
      this.redo()
    })

    // Zoom buttons
    document.getElementById('zoom-in').addEventListener('click', () => {
      this.zoom(1.1)
    })

    document.getElementById('zoom-out').addEventListener('click', () => {
      this.zoom(0.9)
    })

    // Text size slider
    document.getElementById('text-size').addEventListener('input', (e) => {
      document.getElementById('size-display').textContent = e.target.value
    })

    // Draw color and width
    document.getElementById('draw-color').addEventListener('input', (e) => {
      this.drawColor = e.target.value
    })

    document.getElementById('draw-width').addEventListener('input', (e) => {
      this.drawWidth = parseInt(e.target.value)
      document.getElementById('draw-size-display').textContent = e.target.value
    })
  }

  selectTool(tool) {
    this.selectedTool = tool
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    document.querySelector(`[data-tool="${tool}"]`).classList.add('active')

    // Show/hide panels
    document.getElementById('text-panel').style.display = tool === 'text' ? 'block' : 'none'
    document.getElementById('shape-panel').style.display = tool === 'shape' ? 'block' : 'none'
    document.getElementById('image-panel').style.display = tool === 'image' ? 'block' : 'none'
    document.getElementById('draw-panel').style.display = tool === 'draw' ? 'block' : 'none'
    
    // Update cursor
    if (tool === 'draw') {
      this.canvas.style.cursor = 'crosshair'
    } else if (tool === 'select') {
      this.canvas.style.cursor = 'default'
    } else {
      this.canvas.style.cursor = 'pointer'
    }
  }

  handleCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (this.selectedTool === 'text') {
      const text = document.getElementById('text-input').value || 'Sample Text'
      this.addTextElement(x, y, text)
    }
  }

  addTextElement(x, y, text) {
    const fontSize = parseInt(document.getElementById('text-size').value)
    const color = document.getElementById('text-color').value
    const font = document.getElementById('text-font').value

    const element = {
      type: 'text',
      x,
      y,
      text,
      fontSize,
      color,
      font,
      id: Date.now()
    }

    this.elements.push(element)
    this.saveState()
    this.redraw()
  }

  addText(text) {
    if (text) {
      this.addTextElement(400, 300, text)
    }
  }

  addShape(shapeType) {
    const color = document.getElementById('shape-color').value
    const element = {
      type: 'shape',
      shape: shapeType,
      x: 400,
      y: 300,
      width: 100,
      height: 100,
      color,
      id: Date.now()
    }

    this.elements.push(element)
    this.saveState()
    this.redraw()
  }

  handleImageUpload(e) {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const element = {
            type: 'image',
            x: 200,
            y: 200,
            width: img.width,
            height: img.height,
            image: img,
            id: Date.now()
          }
          this.elements.push(element)
          this.saveState()
          this.redraw()
        }
        img.src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (this.selectedTool === 'select') {
      // Find clicked element
      this.selectedElement = this.findElementAt(x, y)
      if (this.selectedElement) {
        this.isDragging = true
        this.dragOffset.x = x - this.selectedElement.x
        this.dragOffset.y = y - this.selectedElement.y
      }
    }
  }

  handleMouseMove(e) {
    if (this.isDragging && this.selectedElement) {
      const rect = this.canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      this.selectedElement.x = x - this.dragOffset.x
      this.selectedElement.y = y - this.dragOffset.y
      this.redraw()
    }
  }

  handleMouseUp() {
    this.isDragging = false
  }

  startDrawing(e) {
    this.isDrawing = true
    const rect = this.canvas.getBoundingClientRect()
    this.lastX = e.clientX - rect.left
    this.lastY = e.clientY - rect.top
  }

  draw(e) {
    if (!this.isDrawing) return

    const rect = this.canvas.getBoundingClientRect()
    const currentX = e.clientX - rect.left
    const currentY = e.clientY - rect.top

    this.ctx.beginPath()
    this.ctx.moveTo(this.lastX, this.lastY)
    this.ctx.lineTo(currentX, currentY)
    this.ctx.strokeStyle = this.drawColor
    this.ctx.lineWidth = this.drawWidth
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.ctx.stroke()

    this.lastX = currentX
    this.lastY = currentY
  }

  stopDrawing() {
    if (this.isDrawing) {
      this.saveState()
    }
    this.isDrawing = false
  }

  saveState() {
    // Save current state to history
    this.history = this.history.slice(0, this.historyIndex + 1)
    this.history.push(JSON.parse(JSON.stringify(this.elements)))
    this.historyIndex = this.history.length - 1
    
    // Limit history size
    if (this.history.length > 50) {
      this.history.shift()
      this.historyIndex--
    }
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--
      this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
      this.redraw()
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++
      this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]))
      this.redraw()
    }
  }

  zoom(factor) {
    const currentZoom = parseFloat(document.querySelector('.zoom-level').textContent) / 100
    const newZoom = Math.max(0.5, Math.min(2, currentZoom * factor))
    document.querySelector('.zoom-level').textContent = Math.round(newZoom * 100) + '%'
    
    const canvasWrapper = document.querySelector('.canvas-wrapper')
    canvasWrapper.style.transform = `scale(${newZoom})`
    canvasWrapper.style.transformOrigin = 'center'
  }

  findElementAt(x, y) {
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const el = this.elements[i]
      if (x >= el.x && x <= el.x + (el.width || 100) &&
          y >= el.y && y <= el.y + (el.height || 50)) {
        return el
      }
    }
    return null
  }

  redraw() {
    // Clear canvas
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Redraw template
    this.drawProductTemplate()

    // Draw all elements
    this.elements.forEach(element => {
      this.drawElement(element)
    })

    // Draw selection
    if (this.selectedElement) {
      this.drawSelection(this.selectedElement)
    }
  }

  drawElement(element) {
    this.ctx.save()

    switch (element.type) {
      case 'text':
        this.ctx.font = `${element.fontSize}px ${element.font}`
        this.ctx.fillStyle = element.color
        this.ctx.fillText(element.text, element.x, element.y)
        break

      case 'shape':
        this.ctx.fillStyle = element.color
        if (element.shape === 'rect') {
          this.ctx.fillRect(element.x, element.y, element.width, element.height)
        } else if (element.shape === 'circle') {
          this.ctx.beginPath()
          this.ctx.arc(element.x + element.width/2, element.y + element.height/2, element.width/2, 0, Math.PI * 2)
          this.ctx.fill()
        } else if (element.shape === 'line') {
          this.ctx.strokeStyle = element.color
          this.ctx.lineWidth = 5
          this.ctx.beginPath()
          this.ctx.moveTo(element.x, element.y)
          this.ctx.lineTo(element.x + element.width, element.y + element.height)
          this.ctx.stroke()
        }
        break

      case 'image':
        if (element.image) {
          this.ctx.drawImage(element.image, element.x, element.y, element.width, element.height)
        }
        break
    }

    this.ctx.restore()
  }

  drawSelection(element) {
    this.ctx.strokeStyle = '#0066ff'
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([5, 5])
    const width = element.width || 100
    const height = element.height || 50
    this.ctx.strokeRect(element.x - 5, element.y - 5, width + 10, height + 10)
    this.ctx.setLineDash([])
  }

  loadTemplate(template) {
    this.productType = template
    this.elements = []
    this.redraw()
  }

  saveDesign() {
    const designData = {
      productType: this.productType,
      elements: this.elements,
      timestamp: Date.now()
    }
    localStorage.setItem('gautam_graphics_design', JSON.stringify(designData))
    alert('Design saved successfully!')
  }

  exportDesign() {
    const dataURL = this.canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = `gautam-graphics-design-${Date.now()}.png`
    link.href = dataURL
    link.click()
    
    // Show enquiry form
    setTimeout(() => {
      if (confirm('Design exported! Would you like to send this design for printing?')) {
        Router.navigate(`/product/${this.productType}-design`)
      }
    }, 500)
  }
}

