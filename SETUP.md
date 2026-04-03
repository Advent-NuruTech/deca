# FancyTech South Sudan - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

From the root directory, run:

```bash
npm run install-all
```

This will install dependencies for:

- Root package (concurrently)
- Backend (Express, MongoDB, etc.)
- Frontend (React, Vite, Redux Toolkit, etc.)

### 2. Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a `.env` file (copy from `.env.example`):

   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fancytech-South Sudan
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development

   # Cloudinary Configuration (for image storage)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

   **Important:**
   - Change `JWT_SECRET` to a strong, random string in production
   - Update `MONGODB_URI` if using MongoDB Atlas or a different MongoDB instance
   - Get your Cloudinary credentials from [cloudinary.com](https://cloudinary.com):
     1. Sign up for a free account at cloudinary.com
     2. Go to your Dashboard
     3. Copy your Cloud Name, API Key, and API Secret
     4. Add them to your `.env` file

4. (Optional) Create the uploads directory for local storage fallback:
   ```bash
   mkdir uploads
   ```
   Note: With Cloudinary integration, images are stored in the cloud, but this directory can be kept for backward compatibility.

### 3. Frontend Setup

The frontend is already configured. No additional setup needed.

### 4. Create Admin User

After starting MongoDB, create an admin user:

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

### 5. Start the Application

From the root directory:

```bash
npm run dev
```

This will start:

- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

Or start them separately:

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

## Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin/dashboard

## Production Build

### Build Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Serve Frontend with Backend

You can serve the frontend build from the Express server by adding this to `backend/server.js`:

```javascript
// Serve static files from React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
```

## Environment Variables

### Backend (.env)

| Variable    | Description                          | Default                                         |
| ----------- | ------------------------------------ | ----------------------------------------------- |
| PORT        | Server port                          | 5000                                            |
| MONGODB_URI | MongoDB connection string            | mongodb://localhost:27017/fancytech-South Sudan |
| JWT_SECRET  | Secret key for JWT tokens            | (required)                                      |
| NODE_ENV    | Environment (development/production) | development                                     |

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

- Change the `PORT` in backend `.env`
- Update the proxy in `frontend/vite.config.js` if needed

### Image Upload Issues

- Ensure the `backend/uploads` directory exists
- Check file permissions
- Verify file size limits (currently 5MB)

## Next Steps

1. Create your first admin user
2. Log in to the admin panel
3. Add products and articles
4. Customize the content for your business
5. Set up production environment variables
6. Deploy to your hosting platform

## Support

For issues or questions, please refer to the main README.md file.
