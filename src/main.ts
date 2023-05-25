import { createApp } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import App from './App.vue';

// Import components for the different pages
import WeatherSearch from './components/WeatherSearch.vue';

// Define route records
const routes: Array<RouteRecordRaw> = [
    { path: '/weather', component: WeatherSearch },
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Create the app instance
createApp(App).use(router).mount('#app');
