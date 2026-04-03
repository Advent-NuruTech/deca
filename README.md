# FancyTech South Sudan - E-Commerce & Content Management System

A professional MERN stack application for FancyTech South Sudan, featuring a marketplace for Starlink Kits, Networking Equipment, Laptops, Phones, and Software Solutions, with integrated SEO-optimized content management.

## Features

- 🛍️ **Product Marketplace** - Browse and manage products across multiple categories
- 📝 **SEO-Optimized Articles** - Content management system for blog posts and articles
- 👨‍💼 **Admin Dashboard** - Full backend management for products and articles
- 🔍 **SEO Ready** - Meta tags, structured data, and optimized URLs
- 🔐 **Authentication** - Secure admin authentication system
- 📱 **Responsive Design** - Modern, mobile-friendly UI
- ☁️ **Cloudinary Integration** - Cloud-based image storage and optimization

## Tech Stack

- **Frontend**: React 18 + Vite + Redux Toolkit + Tailwind CSS
- **Backend**: Express.js + MongoDB + Mongoose
- **State Management**: Redux Toolkit
- **SEO**: React Helmet Async
- **Image Storage**: Cloudinary

## Installation

1. **Install all dependencies:**

   ```bash
   npm run install-all
   ```

2. **Set up environment variables:**

   **Backend:**
   - Copy `backend/.env.example` to `backend/.env`
   - Update MongoDB URI and JWT secret
   - Add Cloudinary credentials:
     ```env
     CLOUDINARY_CLOUD_NAME=your-cloud-name
     CLOUDINARY_API_KEY=your-api-key
     CLOUDINARY_API_SECRET=your-api-secret
     ```

   **Frontend (for production):**
   - Create `frontend/.env` file
   - Add: `VITE_API_URL=https://fancytechintegration.onrender.com/api`
   - For development, the app will use the proxy configured in `vite.config.js`

3. **Start development servers:**

   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend server on `http://localhost:3000`

## Production Deployment

### Backend (Render.com)

- **URL**: `https://fancytechintegration.onrender.com`
- **CORS**: Configured to allow requests from `https://fancytechintegration.vercel.app`
- **Environment Variables**: Set CLOUDINARY credentials in Render dashboard

### Frontend (Vercel)

- **URL**: `https://fancytechintegration.vercel.app`
- **API**: Automatically uses production backend URL in production builds
- **Environment Variable**: Set `VITE_API_URL=https://fancytechintegration.onrender.com/api` in Vercel
- **SPA Routing**: Configured via `frontend/vercel.json` to handle React Router routes

### Image URLs

All image URLs are automatically configured to use the production backend URL in production builds. The app uses a utility function (`getImageUrl`) that:

- Uses production backend URL (`https://fancytechintegration.onrender.com`) in production
- Uses localhost for development
- Handles both absolute and relative image paths
- Supports Cloudinary URLs (full URLs are used as-is)

## Project Structure

```
fancyTechSouth Sudan/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── config/          # Cloudinary configuration
│   ├── uploads/         # Uploaded images (legacy, now using Cloudinary)
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   ├── services/    # API services
│   │   └── utils/       # Utilities
│   ├── vercel.json      # Vercel SPA routing config
│   └── public/          # Static assets
└── package.json
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Articles

- `GET /api/articles` - Get all published articles
- `GET /api/articles/:slug` - Get article by slug
- `POST /api/articles` - Create article (Admin)
- `PUT /api/articles/:id` - Update article (Admin)
- `DELETE /api/articles/:id` - Delete article (Admin)

### Auth

- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Upload

- `POST /api/upload` - Upload single image to Cloudinary (Admin)
- `POST /api/upload/multiple` - Upload multiple images to Cloudinary (Admin)
- `DELETE /api/upload/:publicId` - Delete image from Cloudinary (Admin)

**Note:** Images are stored in Cloudinary. You need to configure Cloudinary credentials in your `.env` file. See [SETUP.md](./SETUP.md) for details.

## Creating Admin Account

After setting up MongoDB, create an admin account:

```bash
cd backend
npm run create-admin
```

Or with custom credentials:

```bash
npm run create-admin "Admin Name" "admin@example.com" "securepassword"
```

Default credentials:

- Email: `admin@fancytechSouth Sudan.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the default password immediately after first login!

## Troubleshooting

### Image Upload Fails

1. **Check Cloudinary credentials** - Ensure all three environment variables are set in your backend `.env` file
2. **Check backend logs** - Look for Cloudinary configuration warnings
3. **Check browser console** - Detailed error messages are logged
4. **Verify file size** - Maximum file size is 5MB
5. **Verify file type** - Only jpg, jpeg, png, gif, webp are allowed

### Vercel 404 Errors

- Ensure `frontend/vercel.json` is present and configured correctly
- Redeploy after adding the vercel.json file
- Check that the build output directory is `dist` (Vite default)

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## License

MIT
