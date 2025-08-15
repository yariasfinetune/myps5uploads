# Video List App

A Vue.js application that fetches and displays a list of videos from an API endpoint with full-screen video viewing capabilities.

## Features

- Fetches video data from the specified API endpoint
- Displays videos in a responsive grid layout
- **NEW**: Individual video pages with full-screen viewing
- **NEW**: Navigation between video list and individual videos
- Shows video metadata (file size, last modified date)
- Pagination support
- Modern, responsive UI design
- Error handling and loading states
- Full-screen video player with controls

## Routes

- `/` - Main video list page
- `/video/:key` - Individual video player page (full-screen)

## API Endpoint

The app fetches video data from:
```
https://vwtinclon6jl45cqrtqfqrkyfu0uphst.lambda-url.us-east-1.on.aws/
```

Request body:
```json
{
  "page": 1
}
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
video-list-app/
├── src/
│   ├── components/
│   │   ├── VideoList.vue      # Main video list component
│   │   └── VideoPlayer.vue    # Full-screen video player
│   ├── App.vue                # Main app component with router
│   ├── main.js                # Application entry point
│   └── router.js              # Vue Router configuration
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## Technologies Used

- Vue.js 3
- Vue Router 4
- Vite (build tool)
- Axios (HTTP client)
- CSS Grid (responsive layout)

## Usage

1. **Video List Page**: Browse through all available videos with thumbnails and metadata
2. **Video Player Page**: Click on any video to view it in full-screen mode
3. **Navigation**: Use the "Back to Videos" button to return to the main list
4. **Full-Screen Mode**: Use the fullscreen button in the video player for immersive viewing

## Notes

- The video URLs are constructed using the bucket name from the API response
- The app assumes 10 items per page for pagination calculation
- Videos are displayed with HTML5 video tags with controls
- The UI is fully responsive and works on mobile devices
- Video keys are URL-encoded for safe routing
