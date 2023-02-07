import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/part1',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/part2',
      name: 'part2',
      component: () => import('../views/part2.vue')
    },
    {
      path: '/part3',
      name: 'part3',
      component: () => import('../views/part3.vue')
    },
    {
      path: '/part4',
      name: 'part4',
      component: () => import('../views/part4.vue')
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
