export const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      title: "首页",
      icon: "home",
    },
    redirect: { path: '/index' },
    id: "0-0",
    order: 0,
    type: "1",
    parentId: "0",
    children: [
      {
        path: "/index",
        name: "Index",
        component: () => import("pages/index/Index.vue"),
        meta: {
          title: "首页",
          affix: true,
        },
        children: []
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    hidden: true,
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: "/personal",
    hidden: true,
    redirect: "personal",
    children: [
      {
        path: "center",
        name: "center",
        component: () => import("pages/personalCenter/Index"),
        meta: {
          title: "个人中心",
        },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  /*
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
  */
]

export const asyncRoutes = [

];
export default { constantRoutes, asyncRoutes } ;
