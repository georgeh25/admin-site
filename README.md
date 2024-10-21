# Portfolio Admin

Portfolio Admin is a web application for managing my personal portfolio. It allows you to easily update my projects, work experiences, skills, and personal information through a user-friendly interface.

## Features

- Manage projects
- Update work experiences
- Add and remove skills/technologies
- Edit "About Me" information
- Manage social network links
- User authentication and authorization

## Technologies Used

- Frontend: React.js with React Bootstrap, built with Vite
- Backend: Node.js with Express.js
- Database: MongoDB
- State Management: Redux
- HTTP Client: Axios
- Package Manager: Yarn

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- Yarn (v1.22.0 or later)
- MongoDB (v4.0.0 or later)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/portfolio-admin.git
   cd portfolio-admin
   ```

2. Install dependencies for both frontend and backend:

   ```
   yarn install
   cd client
   yarn install
   cd ..
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Create a `.env` file in the `client` directory and add:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Development Deployment

To run the application in development mode:

1. Start the backend server:

   ```
   yarn server
   ```

2. In a new terminal, start the frontend development server:

   ```
   cd client
   yarn dev
   ```

3. Open your browser and visit the URL provided by Vite (usually `http://localhost:5173`)

The frontend will hot-reload as you make changes, and the backend will restart automatically when files are changed (using nodemon).

## Production Deployment

For production deployment, follow these steps:

1. Build the React frontend:

   ```
   cd client
   yarn build
   cd ..
   ```

2. Set the following environment variables on your production server:

   ```   
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   PORT=your_production_port
   ```

3. Copy the entire project to your production server.

4. Install production dependencies:

   ```
   yarn install --production
   ```

5. Start the server:
   ```
   yarn start
   ```

For platforms like Heroku or Vercel, the deployment process might be simplified. Ensure you set the environment variables in your hosting platform's dashboard or configuration.

If you have any questions, feel free to reach out me at jorgehome7@gmail.com.
