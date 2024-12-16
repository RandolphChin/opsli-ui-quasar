const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
     { path: '', component: () => import('pages/IndexPage.vue'), meta: { title: '首页', requiresAuth: true }, name: 'Index', children : [] },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/LoginPage.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
