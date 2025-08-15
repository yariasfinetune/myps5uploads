import { createRouter, createWebHistory } from 'vue-router'
import VideoList from './components/VideoList.vue'
import VideoPlayer from './components/VideoPlayer.vue'

const routes = [
  {
    path: '/',
    name: 'VideoList',
    component: VideoList
  },
  {
    path: '/video/:fileKey',
    name: 'VideoPlayer',
    component: VideoPlayer,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
