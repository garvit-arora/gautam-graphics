# Gautam Graphics - Premium Printing & Design Solutions

A stunning, modern e-commerce website for Gautam Graphics, featuring a custom design editor, product catalog, and seamless user experience.

## Features

### 🎨 **Design Studio (Canva-like Editor)**
- Custom canvas editor for creating designs
- Support for multiple product types (Mugs, T-Shirts, Wedding Cards, Letterheads)
- Text editing with custom fonts, sizes, and colors
- Shape tools (rectangles, circles, lines)
- Image upload functionality
- Freehand drawing tool with adjustable brush size
- Export designs as PNG images
- Save designs locally

### 🛍️ **E-Commerce Features**
- Product catalog with beautiful product cards
- Product detail pages with size selection
- Shopping cart functionality
- Enquiry form for custom orders
- User authentication (Login/Signup)
- Protected routes for authenticated users

### 📍 **Location Information**
- Store location details (Sector 16, Rohini, Delhi)
- Business hours and contact information
- Directions via metro, bus, and car
- Google Maps integration

### ✨ **Animations & UI**
- GSAP-powered animations throughout
- Printing animation loader
- Smooth page transitions
- Hover effects and micro-interactions
- Responsive design for all devices
- Modern, elegant UI with gradient accents

## Tech Stack

- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - No framework dependencies
- **GSAP** - Advanced animations
- **Canvas API** - Design editor functionality
- **LocalStorage** - Data persistence

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable components (Navigation)
├── pages/           # Page components
│   ├── Store.js
│   ├── Login.js
│   ├── Signup.js
│   ├── ProductDetail.js
│   ├── DesignEditor.js
│   ├── Location.js
│   └── Cart.js
├── utils/           # Utility functions
│   ├── router.js    # Client-side routing
│   ├── auth.js      # Authentication logic
│   └── loader.js    # Loading animations
└── styles/          # CSS styles
    └── index.css
```

## Key Features Explained

### Authentication
- User registration and login
- Session management via localStorage
- Protected routes for authenticated features

### Design Editor
- Full-featured canvas editor
- Multiple tools: Select, Text, Shapes, Images, Drawing
- Real-time preview
- Export functionality

### Shopping Cart
- Add products to cart
- Quantity management
- Order summary with pricing
- Checkout flow (ready for payment integration)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary software for Gautam Graphics.

## Contact

**Gautam Graphics**
- Location: Sector 16, Rohini, Delhi - 110089, India
- Email: info@gautamgraphics.com

---

Built with ❤️ for Gautam Graphics
