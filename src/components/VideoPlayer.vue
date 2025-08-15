<template>
  <div class="video-player-page">
    <!-- Navigation Header -->
    <header class="video-header">
      <button @click="goBack" class="back-btn">
        <span class="back-icon">←</span>
        Back to Videos
      </button>
      <h1 class="video-title">{{ videoTitle }}</h1>
      <div class="header-spacer"></div>
    </header>

    <!-- Full Screen Video Container -->
    <div class="video-container">
      <div v-if="loading" class="loading">
        <p>Loading video...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>Error: {{ error }}</p>
        <button @click="retryLoad" class="retry-btn">Retry</button>
      </div>
      
      <div v-else class="video-wrapper">
        <video 
          ref="videoElement"
          :src="videoUrl" 
          controls 
          autoplay
          class="fullscreen-video"
          @error="handleVideoError"
          @loadeddata="handleVideoLoaded"
        >
          Your browser does not support the video tag.
        </video>
        
        <!-- Video Controls Overlay -->
        <div class="video-controls-overlay" v-if="showControls">
          <div class="controls-content">
            <div class="video-info">
              <h2>{{ videoTitle }}</h2>
              <p class="video-url">{{ videoUrl }}</p>
            </div>
            <div class="control-buttons">
              <button @click="toggleFullscreen" class="control-btn">
                {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen' }}
              </button>
              <button @click="goBack" class="control-btn">
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Details Panel -->
    <!-- <div class="video-details" v-if="!isFullscreen">
      <div class="details-content">
        <h3>Video Details</h3>
        <div class="detail-item">
          <strong>Title:</strong> {{ videoTitle }}
        </div>
        <div class="detail-item">
          <strong>URL:</strong> 
          <a :href="videoUrl" target="_blank" class="video-link">{{ videoUrl }}</a>
        </div>
        <div class="detail-item">
          <strong>Key:</strong> {{ decodedKey }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: {
    fileKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      showControls: false,
      isFullscreen: false
    }
  },
  computed: {
    decodedKey() {
      try {
        // Decode the base64 encoded key
        return atob(this.fileKey)
      } catch (e) {
        // If base64 decoding fails, try URL decoding as fallback
        try {
          return decodeURIComponent(this.fileKey)
        } catch (e2) {
          // If both fail, return the original key
          return this.fileKey
        }
      }
    },
    videoTitle() {
      const filename = this.decodedKey.split('/').pop()
      return filename ? filename.replace(/\.[^/.]+$/, '') : 'Video'
    },
    videoUrl() {
      return `https://ps5.jsarias.me/${this.decodedKey}`
    }
  },
  mounted() {
    this.loadVideo()
    this.setupFullscreenListener()
  },
  beforeUnmount() {
    this.removeFullscreenListener()
  },
  methods: {
    loadVideo() {
      this.loading = true
      this.error = null
      
      // Simulate loading time for better UX
      setTimeout(() => {
        this.loading = false
      }, 500)
    },
    
    handleVideoLoaded() {
      this.loading = false
    },
    
    handleVideoError() {
      this.loading = false
      this.error = 'Failed to load video. Please check the URL and try again.'
    },
    
    retryLoad() {
      this.loadVideo()
    },
    
    goBack() {
      this.$router.push('/')
    },
    
    toggleFullscreen() {
      if (!this.isFullscreen) {
        this.enterFullscreen()
      } else {
        this.exitFullscreen()
      }
    },
    
    enterFullscreen() {
      const videoElement = this.$refs.videoElement
      if (videoElement) {
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen()
        } else if (videoElement.webkitRequestFullscreen) {
          videoElement.webkitRequestFullscreen()
        } else if (videoElement.msRequestFullscreen) {
          videoElement.msRequestFullscreen()
        }
      }
    },
    
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
    
    setupFullscreenListener() {
      document.addEventListener('fullscreenchange', this.handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange)
      document.addEventListener('msfullscreenchange', this.handleFullscreenChange)
    },
    
    removeFullscreenListener() {
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', this.handleFullscreenChange)
    },
    
    handleFullscreenChange() {
      this.isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      )
    }
  }
}
</script>

<style scoped>
.video-player-page {
  min-height: 100vh;
  background: #000;
  color: white;
}

.video-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.back-icon {
  font-size: 1.2rem;
}

.video-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
  flex: 1;
}

.header-spacer {
  width: 120px; /* Same width as back button for centering */
}

.video-container {
  padding-top: 80px; /* Account for fixed header */
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.error {
  color: #ff6b6b;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
}

.retry-btn:hover {
  background: #5a6fd8;
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.fullscreen-video {
  width: 100%;
  height: auto;
  max-height: calc(100vh - 120px);
  background: #000;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.video-controls-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-wrapper:hover .video-controls-overlay {
  opacity: 1;
}

.controls-content {
  text-align: center;
  padding: 2rem;
}

.video-info h2 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.video-url {
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  word-break: break-all;
}

.control-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.video-details {
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
}

.details-content {
  max-width: 1200px;
  margin: 0 auto;
}

.details-content h3 {
  margin-bottom: 1rem;
  color: #667eea;
}

.detail-item {
  margin: 0.5rem 0;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
}

.video-link {
  color: #667eea;
  text-decoration: none;
  word-break: break-all;
}

.video-link:hover {
  text-decoration: underline;
}

/* Fullscreen styles */
.video-player-page:fullscreen .video-header,
.video-player-page:-webkit-full-screen .video-header,
.video-player-page:-moz-full-screen .video-header {
  display: none;
}

.video-player-page:fullscreen .video-details,
.video-player-page:-webkit-full-screen .video-details,
.video-player-page:-moz-full-screen .video-details {
  display: none;
}

.video-player-page:fullscreen .video-container,
.video-player-page:-webkit-full-screen .video-container,
.video-player-page:-moz-full-screen .video-container {
  padding-top: 0;
}

.video-player-page:fullscreen .fullscreen-video,
.video-player-page:-webkit-full-screen .fullscreen-video,
.video-player-page:-moz-full-screen .fullscreen-video {
  max-height: 100vh;
  border-radius: 0;
}

@media (max-width: 768px) {
  .video-header {
    padding: 1rem;
  }
  
  .video-title {
    font-size: 1rem;
  }
  
  .back-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .header-spacer {
    width: 100px;
  }
  
  .video-container {
    padding-top: 70px;
  }
  
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .video-details {
    padding: 1rem;
  }
}
</style>
