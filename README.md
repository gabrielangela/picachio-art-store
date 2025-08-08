# 🎨 Picachio Art Store

**Modern E-commerce Web Application for Art Products**

A full-stack web application built with React and Firebase, featuring role-based authentication, product management, and shopping cart functionality.

## 🚀 Features

### Customer Features
- **Product Browsing**: View art products with detailed information
- **Advanced Filtering**: Filter by category, brand, and price
- **Smart Sorting**: Sort products by price (low to high / high to low)
- **Shopping Cart**: Add, remove, and update product quantities
- **User Authentication**: Login/Register with email or Google OAuth
- **Responsive Design**: Optimized for all device sizes

### Admin Features
- **Product Management**: Full CRUD operations for products
- **Admin Dashboard**: Overview of products and analytics
- **User Management**: Manage user roles and permissions
- **Image Upload**: Upload product images with Uploadcare
- **Protected Routes**: Role-based access control

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Vite 6.3.5** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Uploadcare** - File upload service

### Backend & Database
- **Firebase Authentication** - User authentication
- **Firestore** - NoSQL database
- **Firebase Storage** - File storage

## 📁 Project Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── layout/             # Layout components
│   ├── redux/              # Redux store and slices
│   ├── context/            # React Context (Auth)
│   ├── routes/             # Router configuration
│   ├── configs/            # Firebase configuration
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd p2-ip01-gabrielangela
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Update `client/src/configs/firebase.js` with your config

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:5173 in your browser

## 🔐 User Roles

### Client Role
- Browse and filter products
- Add products to cart
- Manage cart items
- View product details

### Admin Role
- All client permissions +
- Add new products
- Edit existing products
- Delete products
- Access admin dashboard
- Manage user roles

## 🎯 Key Features Implementation

### Authentication Flow
- Firebase Authentication with email/password
- Google OAuth integration
- Role-based access control
- Protected routes for admin features

### Product Management
- CRUD operations with Firestore
- Image upload with Uploadcare
- Advanced filtering and sorting
- Pagination with cursor-based navigation

### Shopping Cart
- Redux state management
- Persistent cart state
- Quantity management
- Real-time total calculation

## 🎨 Design System

The application uses a modern green-based color palette:
- Primary: `#354f52` (Dark Green)
- Secondary: `#52796f` (Medium Green)
- Background: `#cad2c5` to `#84a98c` (Light Green Gradient)
- Surface: `#f9fdfb` (Off White)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-based layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```