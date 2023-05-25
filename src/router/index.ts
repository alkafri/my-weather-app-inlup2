import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import WeatherSearch from '@/components/WeatherSearch.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: WeatherSearch },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
