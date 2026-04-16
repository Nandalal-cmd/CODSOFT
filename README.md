# StyleCart

A full-stack e-commerce application featuring a modern shopping cart with product listings, detailed views, and cart management.

## Features

- Product catalog with search and filtering
- Product detail pages
- Shopping cart functionality
- User authentication (backend setup)
- Responsive design with Tailwind CSS
- Modern React frontend with Vite
- Node.js backend with Express and MongoDB

## Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Tailwind CSS
- ESLint

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS support

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nandalal-cmd/CODSOFT.git
   cd stylecart
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Copy `backend/.env` and configure your MongoDB connection and JWT secret

## Usage

1. Start the backend server:
   ```bash
   cd backend
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```
   The backend will run on `http://localhost:3000` (or your configured port).

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (default Vite port).

3. Open your browser and navigate to the frontend URL to use the application.

## Available Scripts

### Backend
- `npm start` - Start the production server
- `npm run dev` - Start the development server with auto-reload

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## Project Structure

```
stylecart/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── data/
│   ├── public/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.