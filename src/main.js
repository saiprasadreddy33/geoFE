import { createApp } from 'vue';
import App from './App.vue';
import 'leaflet/dist/leaflet.css';

import router from './router'; // Import Vue Router instance

const app = createApp(App);

app.use(router);

app.mount('#app');