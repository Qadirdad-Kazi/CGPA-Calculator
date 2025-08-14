# CGPA Calculator

A modern, user-friendly web application for calculating and tracking Cumulative Grade Point Average (CGPA) with a beautiful, responsive design.

## Features

- **Modern UI/UX**: Beautiful gradient design with glass morphism effects
- **Easy CGPA Calculation**: Intuitive interface for accurate grade point calculations
- **Progress Tracking**: Monitor academic performance over time
- **Course Management**: Organize courses, grades, and credits efficiently
- **Personal Dashboard**: Access personalized analytics and insights
- **Responsive Design**: Works seamlessly on all devices
- **Secure Authentication**: Protected user accounts with JWT tokens

## Tech Stack

### Frontend
- React.js with Material-UI components
- Modern CSS with animations and transitions
- Responsive design for mobile and desktop
- Beautiful gradient themes and glass morphism effects

### Backend
- Node.js with Express.js
- MongoDB for data persistence
- JWT authentication
- RESTful API endpoints

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/CGPA-Calculator.git
cd CGPA-Calculator
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
   - Create a `.env` file in the backend directory
   - Add your MongoDB connection string and JWT secret

5. Start the backend server:
```bash
cd backend
npm start
```

6. Start the frontend development server:
```bash
cd frontend
npm start
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

### Frontend
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

### Backend
- `npm start` - Starts the production server
- `npm run dev` - Starts the development server with nodemon

## Project Structure

```
CGPA-Calculator/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components (Home, Login, Register, About)
│   │   ├── styles/         # CSS and styling files
│   │   └── utils/          # Utility functions and configurations
│   └── public/             # Static assets
├── backend/                 # Node.js backend server
│   ├── models/             # Database models
│   ├── routes/             # API route handlers
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
└── README.md               # Project documentation
```

## Key Pages

### Home Page
- Landing page with feature highlights
- Call-to-action buttons for registration and login
- Responsive design with beautiful animations

### Login Page
- Modern authentication interface
- Form validation and error handling
- Smooth transitions and hover effects

### Register Page
- User registration with password confirmation
- Input validation and success feedback
- Consistent design with login page

### About Page
- Comprehensive information about the application
- Feature explanations and how-to guides
- Team information and mission statement

### Dashboard
- Personal CGPA tracking and analytics
- Course management interface
- Performance insights and progress charts

## Design Features

- **Gradient Backgrounds**: Beautiful purple-blue gradients throughout the app
- **Glass Morphism**: Modern translucent card designs with backdrop blur
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Layout**: Mobile-first design approach
- **Material Design**: Consistent with Material-UI design principles
- **Custom Icons**: Meaningful iconography for better user experience

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for students worldwide**
