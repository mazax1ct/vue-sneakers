import { createApp } from 'vue'
import App from './App.vue'
import { createWebHistory, createRouter } from 'vue-router'

import Home from './pages/Home.vue'
import Favorites from './pages/Favorites.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
   { path: '/favorites', name: 'Favorites', component: Favorites },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
