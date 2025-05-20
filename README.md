# PhD Opportunity Finder

A modern web application for finding PhD opportunities with AI-driven search capabilities.

![PhD Opportunity Finder](https://via.placeholder.com/1200x630/6366f1/FFFFFF?text=PhD+Opportunity+Finder)

## Features

- **Modern UI**: Glassmorphism design with dark/light mode
- **3D Animations**: Interactive background with Three.js
- **Advanced Search**: Find PhD opportunities with sophisticated filtering
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: See results as you search

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Three.js for 3D animations
- Framer Motion for animations

### Backend
- Python/Flask
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd phdaaa
```

2. **Set up the backend**

```bash
cd backend
pip install -r requirements.txt
```

3. **Set up the frontend**

```bash
cd frontend
npm install
```

### Running the Application

#### Option 1: Use the startup script

On Windows:
- Double-click `start-app.bat` or run it from Command Prompt
- For PowerShell users, run `.\start-app.ps1`

#### Option 2: Start servers manually

**Start the Backend:**
```bash
cd backend
python app.py
```

**Start the Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /api/opportunities`: List all PhD opportunities
- `GET /api/opportunity/<id>`: Get details of a specific opportunity
- `POST /api/search`: Advanced search with multiple criteria

## Future Enhancements

- User authentication and profiles
- Saved searches and favorites
- Application tracking
- Recommendation system
- University and advisor reviews

## License

MIT

## Acknowledgments

- Images from Unsplash
- Icons from Heroicons
- 3D effects inspired by Three.js examples
