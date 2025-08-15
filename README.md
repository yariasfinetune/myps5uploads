# Video List App

A Vue.js application that fetches and displays a list of videos from an API endpoint with full-screen video viewing capabilities and timestamp sharing.

## Features

- Fetches video data from the specified API endpoint
- Displays videos in a responsive grid layout
- Individual video pages with full-screen viewing
- Navigation between video list and individual videos
- **NEW**: Timestamp sharing - share videos at specific times
- Shows video metadata (file size, last modified date)
- Pagination support
- Modern, responsive UI design
- Error handling and loading states
- Full-screen video player with controls

## Routes

- `/` - Main video list page
- `/video/:fileKey` - Individual video player page (full-screen)
- `/video/:fileKey/:timestamp` - Video player page starting at specific timestamp (in seconds)

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

## Video Sharing Features

### **Timestamp Sharing**
You can share videos at specific timestamps:

1. **From Video List**: Click "Share Video" to share the video URL
2. **From Video Player**: 
   - Click "Share at Current Time" to share the video at the current playback position
   - Click "Copy Share Link" to copy the current URL to clipboard
3. **Direct URL Access**: Access URLs like:
   - `https://ps5.jsarias.me/video/[encoded-key]` (start from beginning)
   - `https://ps5.jsarias.me/video/[encoded-key]/120` (start at 2 minutes)

### **Share Examples**
- **Video from start**: `https://ps5.jsarias.me/video/bWVkaWEtZmlsZXMvRUFfU1BPUlRTX0ZDMjVfMjAyNV8wOF8xNF8xOF8wMV8wOS53ZWJt`
- **Video at 2:30**: `https://ps5.jsarias.me/video/bWVkaWEtZmlsZXMvRUFfU1BPUlRTX0ZDMjVfMjAyNV8wOF8xNF8xOF8wMV8wOS53ZWJt/150`

### **Sharing Methods**
- **Native Share**: Uses Web Share API on supported devices (mobile)
- **Clipboard Copy**: Fallback for desktop browsers
- **Social Media**: Copy and paste URLs to share on any platform

## Deployment

### Prerequisites
- AWS CLI installed and configured with appropriate credentials
- AWS profile named `personal` configured with access to S3 bucket
- S3 bucket `ps5.jsarias.me` created and configured for static website hosting with public access

### Deploy to S3
```bash
npm run deploy
```

This command will:
1. Build the application (`npm run build`)
2. Copy all files from `dist/` to your S3 bucket (preserves existing files)
3. Configure proper cache headers for static assets
4. Set up SPA routing (redirect 404s to index.html)

**Note**: The deploy script uses `AWS_PROFILE=personal` for all AWS CLI commands. The bucket is configured to make all objects public by default, so no ACL flags are needed.

### Manual Deployment
If you prefer to deploy manually:
```bash
# Build the app
npm run build

# Copy to S3 (preserves existing files)
AWS_PROFILE=personal aws s3 cp dist/ s3://ps5.jsarias.me/ --recursive --cache-control "max-age=31536000,public"

# Upload index.html with no-cache for SPA routing
AWS_PROFILE=personal aws s3 cp dist/index.html s3://ps5.jsarias.me/index.html --cache-control "no-cache,no-store,must-revalidate"

# Configure SPA routing
AWS_PROFILE=personal aws s3api put-bucket-website --bucket ps5.jsarias.me --website-configuration '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"index.html"}}'
```

## Project Structure

```
video-list-app/
├── src/
│   ├── components/
│   │   ├── VideoList.vue      # Main video list component
│   │   └── VideoPlayer.vue    # Full-screen video player with timestamp support
│   ├── App.vue                # Main app component with router
│   ├── main.js                # Application entry point
│   └── router.js              # Vue Router configuration
├── scripts/
│   └── deploy.js              # Deployment script
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
5. **Timestamp Sharing**: Share videos at specific times using the share buttons

## Notes

- The video URLs are constructed using the bucket name from the API response
- The app assumes 10 items per page for pagination calculation
- Videos are displayed with HTML5 video tags with controls
- The UI is fully responsive and works on mobile devices
- Video keys are base64-encoded for safe routing
- Timestamps are in seconds and automatically seek to the specified time
