# Environment Variables Setup

Since `.env.example` files may be hidden in some file explorers, here are the contents you need to create your `.env` file:

## Create `.env` file in the `backend` directory

Create a file named `.env` (not `.env.example`) in the `backend` folder with the following content:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fancytech-South Sudan
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Instructions

1. Navigate to the `backend` folder
2. Create a new file named `.env` (make sure it starts with a dot)
3. Copy and paste the content above
4. **IMPORTANT**: Change the `JWT_SECRET` to a strong, random string for production
5. Update `MONGODB_URI` if you're using MongoDB Atlas or a different MongoDB instance

## Example MongoDB Atlas URI

If using MongoDB Atlas, your URI will look like:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fancytech-South Sudan?retryWrites=true&w=majority
```

## Security Note

- Never commit the `.env` file to version control
- Use a strong, random JWT_SECRET in production
- Keep your MongoDB credentials secure
