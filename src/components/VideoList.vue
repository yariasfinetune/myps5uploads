<template>
  <div class="video-list">
    <header>
      <h1>My PS5 Video List</h1>
    </header>
    
    <main>
      <div v-if="loading" class="loading">
        <p>Loading videos...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>Error: {{ error }}</p>
        <button @click="fetchVideos" class="retry-btn">Retry</button>
      </div>
      
      <div v-else class="video-container">
        <div v-if="videos.length === 0" class="no-videos">
          <p>No videos found.</p>
        </div>
        
        <div v-else class="video-grid">
          <div v-for="video in videos" :key="video.Key" class="video-item">
            <h3>{{ getVideoTitle(video.Key) }}</h3>
            <div class="video-thumbnail" @click="goToVideo(video.Key)">
              <video 
                :src="getVideoUrl(video.Key)" 
                preload="metadata"
                class="video-preview"
                muted
              >
                Your browser does not support the video tag.
              </video>
              <div class="play-overlay">
                <div class="play-button">▶</div>
              </div>
            </div>
            <div class="video-info">
              <p><strong>Size:</strong> {{ formatFileSize(video.Size) }}</p>
              <p><strong>Upload Date:</strong> {{ formatDate(video.LastModified) }}</p>
              <button @click="goToVideo(video.Key)" class="watch-btn">Watch Full Screen</button>
            </div>
          </div>
        </div>
        
        <div class="pagination">
          <button 
            @click="previousPage" 
            :disabled="currentPage <= 1"
            class="page-btn"
          >
            Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="nextPage" 
            :disabled="currentPage >= totalPages"
            class="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'VideoList',
  data() {
    return {
      videos: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      totalObjects: 0
    }
  },
  mounted() {
    this.fetchVideos()
  },
  methods: {
    async fetchVideos() {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('https://vwtinclon6jl45cqrtqfqrkyfu0uphst.lambda-url.us-east-1.on.aws/', {
          page: this.currentPage
        })
        
        this.videos = response.data.objects || []
        this.totalObjects = response.data.total_objects || 0
        this.totalPages = Math.ceil(this.totalObjects / 10) // Assuming 10 items per page
        
      } catch (err) {
        this.error = err.message || 'Failed to fetch videos'
        console.error('Error fetching videos:', err)
      } finally {
        this.loading = false
      }
    },
    
    getVideoTitle(key) {
      // Extract filename from the key and remove extension
      const filename = key.split('/').pop()
      return filename.replace(/\.[^/.]+$/, '') // Remove file extension
    },
    
    getVideoUrl(key) {
      // Construct the video URL using the bucket and key from the API response
      return `https://ps5.jsarias.me/${key}`
    },
    
    formatFileSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      if (bytes === 0) return '0 Bytes'
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchVideos()
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchVideos()
      }
    },
    
    goToVideo(key) {
      // Use base64 encoding to safely pass the key in the URL
      const encodedKey = btoa(key)
      this.$router.push(`/video/${encodedKey}`)
    }
  }
}
</script>

<style scoped>
.video-list {
  min-height: 100vh;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

header h1 {
  font-size: 1.8rem;
  font-weight: 300;
  margin: 0;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 5rem;
}

.loading, .error, .no-videos {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}

.error {
  color: #e74c3c;
}

.retry-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
}

.retry-btn:hover {
  background: #2980b9;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.video-item {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.video-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.video-item h3 {
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-size: 1.1rem;
  color: #495057;
}

.video-thumbnail {
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.video-preview {
  width: 100%;
  height: 250px;
  object-fit: cover;
  background: #000;
  transition: transform 0.3s ease;
}

.video-thumbnail:hover .video-preview {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-thumbnail:hover .play-overlay {
  opacity: 1;
}

.play-button {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #333;
  transition: transform 0.3s ease;
}

.video-thumbnail:hover .play-button {
  transform: scale(1.1);
}

.video-info {
  padding: 1rem;
  background: #f8f9fa;
}

.video-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.watch-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.watch-btn:hover {
  background: #5a6fd8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}

@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  header h1 {
    font-size: 1.5rem;
  }
  
  header {
    padding: 0.8rem 0;
  }
  
  main {
    padding: 1rem;
    padding-top: 4rem;
  }
}
</style>
