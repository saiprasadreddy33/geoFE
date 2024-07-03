<template>
  <div>
    <header class="bg-blue-500 p-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center">
        <img src="https://cdn.prod.website-files.com/660e7952369feece9a6c0e45/66462aabb0f40bbb2a9c6709_LOGO%20WHITE.png" alt="Skyserve Logo" class="h-10 mr-2">
      </router-link>
    </header>
    
    <div class="container mx-auto mt-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Navigation Cards -->
        <div class="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
          <router-link :to="{ name: 'Markers' }" class="text-blue-500 hover:text-blue-700 font-bold block mb-2">Manage Markers</router-link>
          <p class="text-gray-600">Manage point markers on the map.</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
          <router-link :to="{ name: 'Shapes' }" class="text-blue-500 hover:text-blue-700 font-bold block mb-2">Manage Shapes</router-link>
          <p class="text-gray-600">Draw and manage custom shapes on the map.</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
          <router-link :to="{ name: 'Upload' }" class="text-blue-500 hover:text-blue-700 font-bold block mb-2">Upload Files</router-link>
          <p class="text-gray-600">Upload GeoJSON/KML and TIFF files.</p>
        </div>
        
        <!-- User Information -->
        <div class="bg-white p-6 rounded-lg shadow-lg col-span-3">
          <h2 class="text-xl font-bold mb-4 text-gray-800">User Information</h2>
          <p class="text-gray-700"><strong>Username:</strong> {{ currentUser.username }}</p>
          <p class="text-gray-700"><strong>Email:</strong> {{ currentUser.email }}</p>
          <p class="text-gray-700"><strong>Joined:</strong> {{ new Date(currentUser.createdAt).toLocaleDateString() }}</p>
        </div>
        
        <!-- Map Display -->
        <div class="bg-white p-6 rounded-lg shadow-lg col-span-3">
          <h2 class="text-xl font-bold mb-4 text-gray-800">Map Display</h2>
          <MapContainer :markers="markers" :shapes="shapes" />
        </div>
        
      </div>
      
    </div>
  </div>
</template>

<script>
import MapContainer from '@/components/Map/MapContainer.vue';
import axios from 'axios';
import '../assets/styles/tailwind.css'

export default {
  name: 'DashboardPage',
  components: {
    MapContainer,
  },
  data() {
    return {
      currentUser: {
        username: '',
        email: '',
        createdAt: '',
      },
      markers: [],
      shapes: [],
    };
  },
  async mounted() {
    try {
      // Fetch user information after successful login (example)
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('https://geobe.onrender.com/api/auth/user', config);
      this.currentUser = response.data;

      // Fetch markers and shapes from backend
      await this.fetchMarkers();
      await this.fetchShapes();
    } catch (error) {
      console.error('Dashboard mount error:', error);
      // Handle error (e.g., show error message)
    }
  },
  methods: {
    async fetchMarkers() {
      try {
        const response = await axios.get('https://geobe.onrender.com/api/markers');
        this.markers = response.data;
      } catch (error) {
        console.error('Fetch markers error:', error);
        // Handle fetch markers error (e.g., show error message)
      }
    },
    async fetchShapes() {
      try {
        const response = await axios.get('https://geobe.onrender.com/api/shapes');
        this.shapes = response.data;
      } catch (error) {
        console.error('Fetch shapes error:', error);
        // Handle fetch shapes error (e.g., show error message)
      }
    },
  },
};
</script>

<style scoped>
.skyserve-logo {
  width: 1rem; /* Adjust size as needed */
}</style>
