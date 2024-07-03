<template>
    <router-link :to="{ name: 'Upload' }" class="text-blue-500 hover:text-blue-700 font-bold">Go to Upload Page</router-link>

  <div class="flex flex-wrap">
    <div class="w-full md:w-3/5">
      <div id="map" style="height: 600px;"></div>
    </div>
    <div class="w-full md:w-2/5 p-4">
      <h3 class="text-xl font-bold mb-4">Uploaded Files</h3>
      <ul>
        <li v-for="file in files" :key="file._id" class="mb-4">
          <div class="relative">
            <span class="text-blue-500 cursor-pointer hover:underline" @click="zoomToFeature(file._id)">
              {{ file.filename }}
            </span>
            <p class="text-gray-600 text-sm">{{ formatDateTime(file.createdAt) }}</p>
            <button @click="deleteFile(file._id)" class="absolute top-0 right-0 p-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import mapboxgl from 'mapbox-gl';

export default {
  name: 'MapComponent',
  data() {
    return {
      file: null,
      files: [],
      map: null,
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    this.fetchFiles();
  },
  methods: {
    async fetchFiles() {
      try {
        const response = await axios.get('https://geobe.onrender.com/api/upload');
        this.files = response.data;

        // Add uploaded files to map
        this.files.forEach(file => {
          if (file.mimetype === 'application/vnd.geo+json') {
            axios.get(`https://geobe.onrender.com/api/upload/${file.path}`).then(data => {
              this.map.addSource(file._id, {
                type: 'geojson',
                data: data
              });

              this.map.addLayer({
                id: `${file._id}-layer`,
                type: 'fill',
                source: file._id,
                layout: {},
                paint: {
                  'fill-color': '#088',
                  'fill-opacity': 0.8
                }
              });
            });
          }
        });
      } catch (error) {
        console.error('Error fetching files:', error.message);
      }
    },
    async uploadFile() {
      try {
        const formData = new FormData();
        formData.append('file', this.file);

        const response = await axios.post('https://geobe.onrender.com/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.files.push(response.data.file);
        this.file = null;

        // Reload files on map after upload
        this.fetchFiles();
      } catch (error) {
        console.error('Error uploading file:', error.message);
      }
    },
    async deleteFile(id) {
      try {
        await axios.delete(`https://geobe.onrender.com/api/upload/${id}`);
        this.files = this.files.filter(file => file._id !== id);

        // Remove layer from map
        this.map.removeLayer(`${id}-layer`);
        this.map.removeSource(id);
      } catch (error) {
        console.error('Error deleting file:', error.message);
      }
    },
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    formatDateTime(datetime) {
      return new Date(datetime).toLocaleString();
    },
    redirectToUploadPage() {
      // Navigate to /upload page
      this.$router.push({ name: 'Upload' });
    },
    zoomToFeature(id) {
      const mapLayer = this.map.getLayer(`${id}-layer`);
      if (mapLayer) {
        const { bounds } = mapLayer.queryRenderedFeatures();
        if (bounds) {
          this.map.fitBounds(bounds, { padding: 20 });
        }
      }
    }
  }
};
</script>

<style scoped>
/* Custom hover effect for files */
li:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
