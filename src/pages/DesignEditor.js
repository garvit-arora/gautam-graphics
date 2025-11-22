import { Navigation } from '../components/Navigation.js'
import { Auth } from '../utils/auth.js'
import { Router } from '../utils/router.js'
import { gsap } from 'gsap'
import * as fabric from 'fabric'
import { templates } from '../utils/editorTemplates.js'

export class DesignEditor {
  constructor() {
    this.canvas = null
    this.ctx = null
    this.fcanvas = null
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
    this.undoStack = []
    this.redoStack = []
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
    this.ctx = null
    this.fcanvas = new fabric.Canvas('design-canvas', {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true
    })
    this.fcanvas.isDrawingMode = false
    this.fcanvas.freeDrawingBrush = new fabric.PencilBrush(this.fcanvas)
    this.fcanvas.freeDrawingBrush.color = this.drawColor
    this.fcanvas.freeDrawingBrush.width = this.drawWidth

    this.fcanvas.on('object:added', () => this.captureState())
    this.fcanvas.on('object:modified', () => this.captureState())
    this.fcanvas.on('object:removed', () => this.captureState())

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
    // Initialize guideline area for current product
    this.drawProductTemplate()
    this.captureState()
  }

  drawProductTemplate() {
    // Remove existing guideline shapes
    const toRemove = []
    this.fcanvas.getObjects().forEach(obj => {
      if (obj.metaGuide) toRemove.push(obj)
    })
    toRemove.forEach(obj => this.fcanvas.remove(obj))

    // Add guideline depending on product
    if (this.productType === 'mug') {
      const guide = new fabric.Circle({
        left: 400 - 150,
        top: 300 - 150,
        radius: 150,
        fill: 'transparent',
        stroke: '#e0e0e0',
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false
      })
      guide.metaGuide = true
      this.fcanvas.add(guide)
    } else if (this.productType === 'tshirt') {
      const guide = new fabric.Rect({
        left: 200,
        top: 100,
        width: 400,
        height: 400,
        fill: 'transparent',
        stroke: '#e0e0e0',
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false
      })
      guide.metaGuide = true
      this.fcanvas.add(guide)
    } else if (this.productType === 'card') {
      const guide = new fabric.Rect({
        left: 150,
        top: 50,
        width: 500,
        height: 500,
        fill: 'transparent',
        stroke: '#e0e0e0',
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false
      })
      guide.metaGuide = true
      this.fcanvas.add(guide)
    } else if (this.productType === 'letterhead') {
      const guide = new fabric.Rect({
        left: 50,
        top: 50,
        width: 700,
        height: 500,
        fill: 'transparent',
        stroke: '#e0e0e0',
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false
      })
      guide.metaGuide = true
      this.fcanvas.add(guide)
    }
    this.fcanvas.requestRenderAll()
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
        const active = this.fcanvas.getActiveObject()
        if (active && active.type === 'textbox') {
          active.text = e.target.value
          this.fcanvas.requestRenderAll()
        }
      }
    })

    // Fabric mouse down to place text when tool is text
    this.fcanvas.on('mouse:down', (opt) => {
      if (this.selectedTool !== 'text') return
      const text = document.getElementById('text-input').value || 'Sample Text'
      const pointer = this.fcanvas.getPointer(opt.e)
      this.addTextElement(pointer.x, pointer.y, text)
    })

    // Drawing brush controls
    document.getElementById('draw-color').addEventListener('input', (e) => {
      this.drawColor = e.target.value
      if (this.fcanvas.freeDrawingBrush) this.fcanvas.freeDrawingBrush.color = this.drawColor
    })
    document.getElementById('draw-width').addEventListener('input', (e) => {
      this.drawWidth = parseInt(e.target.value)
      document.getElementById('draw-size-display').textContent = e.target.value
      if (this.fcanvas.freeDrawingBrush) this.fcanvas.freeDrawingBrush.width = this.drawWidth
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
        const removals = []
        this.fcanvas.getObjects().forEach(obj => {
          if (!obj.metaGuide) removals.push(obj)
        })
        removals.forEach(obj => this.fcanvas.remove(obj))
        this.captureState()
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

    // Text size slider updates active textbox
    document.getElementById('text-size').addEventListener('input', (e) => {
      document.getElementById('size-display').textContent = e.target.value
      const active = this.fcanvas.getActiveObject()
      if (active && active.type === 'textbox') {
        active.fontSize = parseInt(e.target.value)
        this.fcanvas.requestRenderAll()
      }
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
      this.fcanvas.isDrawingMode = true
      this.canvas.style.cursor = 'crosshair'
    } else {
      this.fcanvas.isDrawingMode = false
      this.canvas.style.cursor = tool === 'select' ? 'default' : 'pointer'
    }
  }

  handleCanvasClick(e) {}

  addTextElement(x, y, text) {
    const fontSize = parseInt(document.getElementById('text-size').value)
    const color = document.getElementById('text-color').value
    const font = document.getElementById('text-font').value
    const textbox = new fabric.Textbox(text, {
      left: x,
      top: y,
      fontSize,
      fontFamily: font,
      fill: color,
      textAlign: 'left',
      editable: true
    })
    this.fcanvas.add(textbox)
    this.fcanvas.setActiveObject(textbox)
    this.fcanvas.requestRenderAll()
  }

  addText(text) {
    if (text) {
      const active = this.fcanvas.getActiveObject()
      if (active && active.type === 'textbox') {
        active.text = text
        this.fcanvas.requestRenderAll()
      }
    }
  }

  addShape(shapeType) {
    const color = document.getElementById('shape-color').value
    let obj
    if (shapeType === 'rect') {
      obj = new fabric.Rect({ left: 380, top: 280, width: 140, height: 100, fill: color, rx: 8, ry: 8 })
    } else if (shapeType === 'circle') {
      obj = new fabric.Circle({ left: 380, top: 280, radius: 60, fill: color })
    } else if (shapeType === 'line') {
      obj = new fabric.Line([360, 260, 480, 320], { stroke: color, strokeWidth: 5 })
    }
    if (obj) {
      this.fcanvas.add(obj)
      this.fcanvas.setActiveObject(obj)
      this.fcanvas.requestRenderAll()
    }
  }

  handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      fabric.Image.fromURL(ev.target.result, (img) => {
        const maxW = 300
        const scale = Math.min(1, maxW / img.width)
        img.set({ left: 200, top: 200, scaleX: scale, scaleY: scale })
        this.fcanvas.add(img)
        this.fcanvas.setActiveObject(img)
        this.fcanvas.requestRenderAll()
      }, { crossOrigin: 'anonymous' })
    }
    reader.readAsDataURL(file)
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

  captureState() {
    const json = this.fcanvas.toJSON(['metaGuide'])
    this.undoStack.push(json)
    this.redoStack = []
    if (this.undoStack.length > 50) this.undoStack.shift()
  }

  undo() {
    if (this.undoStack.length > 1) {
      const current = this.undoStack.pop()
      this.redoStack.push(current)
      const prev = this.undoStack[this.undoStack.length - 1]
      this.fcanvas.loadFromJSON(prev, () => this.fcanvas.requestRenderAll())
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const next = this.redoStack.pop()
      this.undoStack.push(next)
      this.fcanvas.loadFromJSON(next, () => this.fcanvas.requestRenderAll())
    }
  }

  zoom(factor) {
    const currentZoom = this.fcanvas.getZoom()
    const newZoom = Math.max(0.5, Math.min(2, currentZoom * factor))
    this.fcanvas.setZoom(newZoom)
    document.querySelector('.zoom-level').textContent = Math.round(newZoom * 100) + '%'
    this.fcanvas.requestRenderAll()
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

  redraw() {}

  drawElement(element) {}

  drawSelection(element) {}

  loadTemplate(template) {
    this.productType = template
    // Clear existing non-guides
    const removals = []
    this.fcanvas.getObjects().forEach(obj => { if (!obj.metaGuide) removals.push(obj) })
    removals.forEach(obj => this.fcanvas.remove(obj))
    this.drawProductTemplate()

    // Load template objects
    const defs = templates[template] || []
    defs.forEach(def => {
      let obj
      if (def.type === 'circleArea') {
        obj = new fabric.Circle({ left: def.left - def.radius, top: def.top - def.radius, radius: def.radius, fill: 'transparent', stroke: def.stroke || '#d8d8d8', strokeDashArray: def.dash || [8,6], selectable: false, evented: false })
        obj.metaGuide = true
      } else if (def.type === 'rectArea') {
        obj = new fabric.Rect({ left: def.left, top: def.top, width: def.width, height: def.height, fill: 'transparent', stroke: def.stroke || '#d8d8d8', strokeDashArray: def.dash || [8,6], selectable: false, evented: false })
        obj.metaGuide = true
      } else if (def.type === 'shape' && def.shape === 'rect') {
        obj = new fabric.Rect({ left: def.left, top: def.top, width: def.width, height: def.height, fill: def.fill || '#cccccc', opacity: def.opacity || 1, rx: def.rx || 0, ry: def.ry || 0 })
      } else if (def.type === 'textbox') {
        obj = new fabric.Textbox(def.text || '', { left: def.left, top: def.top, fontSize: def.fontSize || 24, fontFamily: def.fontFamily || 'Verdana', fill: def.fill || '#000', textAlign: def.textAlign || 'center', charSpacing: def.charSpacing || 0 })
      }
      if (obj) this.fcanvas.add(obj)
    })
    this.fcanvas.requestRenderAll()
    this.captureState()
  }

  saveDesign() {
    const json = this.fcanvas.toJSON(['metaGuide'])
    const designData = { productType: this.productType, fabric: json, timestamp: Date.now() }
    localStorage.setItem('gautam_graphics_design', JSON.stringify(designData))
    alert('Design saved successfully!')
  }

  exportDesign() {
    const dataURL = this.fcanvas.toDataURL({ format: 'png', multiplier: 2 })
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

