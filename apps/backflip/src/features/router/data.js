// Feature Data: router
// Router configuration and navigation data

export const ROUTER_CONFIG = {
  routes: [
    { path: 'home', component: 'backflip-homepage' },
    { path: 'about', component: 'backflip-about-us' },
    { path: 'services', component: 'services-placeholder' },
    { path: 'contact', component: 'contact-placeholder' },
  ],
};

export function getRouterConfig() {
  return ROUTER_CONFIG;
}

export function getRoutes() {
  return ROUTER_CONFIG.routes;
}

export function getRouteForPath(path) {
  return ROUTER_CONFIG.routes.find(route => route.path === path);
}