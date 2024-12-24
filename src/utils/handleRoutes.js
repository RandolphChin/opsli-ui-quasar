const dict = {
  0: false,
  1: true,
};

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
export function filterAllRoutes(constantRoutes) {
  return constantRoutes.filter((route) => {
    if (route.component) {
      if (route.component === "Layout") {
        route.component = (resolve) => require(["@/layouts"], resolve);
      } else if (route.component === "EmptyLayout") {
        route.component = (resolve) =>
          require(["@/layouts/EmptyLayout"], resolve);
      } else {
        let path = "pages/" + route.component;
        if (
          new RegExp("^/pages/.*$").test(route.component) ||
          new RegExp("^pages/.*$").test(route.component)
        ) {
          path = route.component;
        } else if (new RegExp("^/.*$").test(route.component)) {
          path = "pages" + route.component;
        } else if (new RegExp("^@pages/.*$").test(route.component)) {
          path = route.component.slice(1);
        } else {
          path = "pages/" + route.component;
        }
        route.component = (resolve) => require([`@/${path}`], resolve);
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAllRoutes(route.children);
    }
    if (route.children && route.children.length === 0) {
      delete route.children;
    }

    // 翻译字典
    if (
      "[object Boolean]" !== Object.prototype.toString.call(route.alwaysShow)
    ) {
      route.alwaysShow = dict[route.alwaysShow];
    }
    return true;
  });
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断当前路由是否包含权限
 * @param permissions
 * @param route
 * @returns {boolean|*}
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some((role) => route.meta.permissions.includes(role));
  } else {
    return true;
  }
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description intelligence模式根据permissions数组拦截路由
 * @param routes
 * @param permissions
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, permissions) {
  const finallyRoutes = [];
  routes.forEach((route) => {
    const item = { ...route };
    if (hasPermission(permissions, item)) {
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, permissions);
      }
      finallyRoutes.push(item);
    }
  });
  return finallyRoutes;
}

export function transformRoutes(routes) {
  return routes.map(route => {
    // 确认 component 字段是字符串
    if (typeof route.component === 'string') {
      if (route.component === "Layout") {
        // 使用动态导入替代 require
        route.component = () => import('layouts/MainLayout.vue'); // 修改为正确的动态导入
      } else {
        // 替换 'views/' 为 'pages/'
        const componentPath = route.component.replace(/^views\//, 'pages/'); // 替换路径
        // 使用 import(`@/${componentPath}.vue`) 不生效，只能使用相对地址，相对 handleRoutes.js 文件的地址
        route.component = () => import(`../${componentPath}.vue`); // 确保路径正确
      }
    }

    // 处理子路由
    if (route.children && route.children.length) {
      route.children = transformRoutes(route.children); // 递归处理子路由
    }

    return route;
  });
}
