import { createRouter, createWebHashHistory } from 'vue-router';

import Home from '../components/TheHome.vue';
import Weather from '../components/TheWeather.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/weather/:location', component: Weather },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export default createRouter({
  history: createWebHashHistory(),
  routes
});
