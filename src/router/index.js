import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRouterMap, localRouterMap } from '@/config/router.config';

// hack router push callback
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

// Vue.use(Router)
// const routers = constantRouterMap.concat(localRouterMap);
export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap,
});
