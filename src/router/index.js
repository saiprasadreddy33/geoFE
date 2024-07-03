import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from '@/pages/Dashboard.vue';
import Index from '@/pages/Index.vue';
import Markers from '@/pages/Markers.vue';
import Shapes from '@/pages/Shapes.vue';
import Upload from '@/pages/Upload.vue';
import Login from '@/components/Auth/Login.vue';
import Signup from '@/components/Auth/Signup.vue';
import Map from '@/pages/Map.vue';
import Datasets from '@/pages/Datasets.vue';
import FileUploader from '@/components/FileUpload/FileUploader.vue';


const routes = [
    { path: '/', name: 'Index', component: Index },
    { path: '/login', name: 'Login', component: Login },
    { path: '/signup', name: 'Signup', component: Signup },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/markers', name: 'Markers', component: Markers },
    { path: '/shapes', name: 'Shapes', component: Shapes },
    { path: '/upload', name: 'Upload', component: Upload },
    { path: '/map', name: 'Map', component: Map }, // Add route for Map.vue
    { path: '/datasets', name: 'Datasets', component: Datasets },
    { path: '/file-uploader', name: 'FileUploader', component: FileUploader }, // Add route for FileUploader.vue
  ];
const router = createRouter({
    history: createWebHashHistory(), // Add this line
    base: process.env.BASE_URL,
    routes,
  });
  
  export default router;