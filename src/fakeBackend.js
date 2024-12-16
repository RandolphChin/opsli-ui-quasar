import { mockRoutes } from './mock'; // 引入 mock.js
export const fakeBackend = {
  login(credentials) {
    const { username, password } = credentials;
    if (username === 'admin' && password === 'password') {
      return Promise.resolve({
        token: 'fake-jwt-token',
        user: { id: 1, username: 'admin', name: 'Administrator' },
      });
    }
    return Promise.reject('Invalid username or password');
  },
  getUser() {
    return Promise.resolve({ id: 1, username: 'admin', name: 'Administrator' });
  },
  getDynamicMenu() {
    const dyMenu = [
      ...mockRoutes.map(route => ({
        path: route.path,
        name: route.name,
        title: route.title,
        meta: route.meta,
        component: route.component,
        children: route.children ? route.children : [] // 确保有 children 属性
      }))
    ]
    return Promise.resolve(dyMenu);
  },
  loginOff() {
    return Promise.resolve({ status: true });
  },
};
