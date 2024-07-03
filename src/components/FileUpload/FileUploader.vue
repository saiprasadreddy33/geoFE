<template>
<router-link :to="{ name: 'Upload' }" class="text-blue-500 hover:text-blue-700 font-bold">Go to Upload Page</router-link>
  <div class="container mx-auto p-4">
    <!-- File upload form -->
    <form @submit.prevent="uploadFile" class="mb-4 flex items-center justify-center space-x-4">
      <input type="file" accept=".geojson,.kml,.tiff,.json" @change="handleFileChange">
      <button type="submit" :disabled="!file" class="btn-upload">Upload File</button>
    </form>

    <!-- Toggle button to show/hide datasets -->
    <button @click="toggleDatasets" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mt-4">
      {{ showDatasets ? 'Hide Datasets' : 'Show Datasets' }}
    </button>

    <!-- Mapbox GL JS map container -->
    <div ref="mapContainer" class="map-container mt-4"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default {
  data() {
    return {
      file: null,
      files: [],
      showDatasets: true,
      map: null,
      markers: [],
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xvd3JpZSIsImEiOiJja21wMHpnMnIwYzM5Mm90OWFqaTlyejhuIn0.TXE-FIaqF4K_K1OirvD0wQ';
    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2,
    });
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    uploadFile() {
      if (!this.file) {
        console.error('No file selected for upload');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result;
        const filename = this.file ? this.file.name : 'unknown';
        const mimetype = this.file ? this.file.type : 'unknown';
        const size = this.file ? this.file.size : 0;

        this.files.push({ filename, mimetype, size, content });

        // Display markers on map
        this.displayMarkers();
      };
      reader.readAsText(this.file);
    },
    toggleDatasets() {
      this.showDatasets = !this.showDatasets;
      // Toggle markers visibility on map
      this.toggleMarkersVisibility();
    },
    displayMarkers() {
      this.files.forEach(file => {
        const coordinates = this.getCoordinates(file);
        if (coordinates) {
          const marker = new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(new mapboxgl.Popup().setHTML(`
              <h4>${file.filename}</h4>
              <p>${file.mimetype}</p>
              <p>${file.size} bytes</p>
            `))
            .addTo(this.map);

          this.markers.push(marker);
        } else {
          alert(`Invalid file: ${file.filename}. Check file type and content.`)
          this.showAlert(`Invalid file: ${file.filename}. Check file type and content.`);
        }
      });
    },
    toggleMarkersVisibility() {
      this.markers.forEach(marker => {
        if (this.showDatasets) {
          marker.addTo(this.map);
        } else {
          marker.remove();
        }
      });
    },
    getCoordinates(file) {
      const ext = file.filename.split('.').pop().toLowerCase();
      let coordinates = null;

      switch (ext) {
        case 'geojson':
        case 'json':
          coordinates = this.getGeoJSONCoordinates(file);
          break;
        case 'kml':
          coordinates = this.getKMLCoordinates(file);
          break;
        case 'tiff':
          coordinates = this.getTIFFCoordinates(file);
          break;
        default:
          console.error('Unsupported file format');
      }

      return coordinates;
    },
    getGeoJSONCoordinates(file) {
  try {
    const geojson = JSON.parse(file.content);
    if (geojson.type === 'FeatureCollection') {
      geojson.features.forEach(feature => {
        if (feature.geometry.type === 'Point') {
          const coordinates = feature.geometry.coordinates;
          if (coordinates.length > 0) {
            const lng = coordinates[0];
            const lat = coordinates[1];
            if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
              return [lng, lat];
            } else {
              console.error('Invalid coordinates:', lng, lat);
              return null;
            }
          } else {
            console.error('Invalid coordinates:', coordinates);
            return null;
          }
        } else if (feature.geometry.type === 'LineString') {
          const coordinates = feature.geometry.coordinates;
          if (coordinates.length > 0) {
            const lng = coordinates[0][0];
            const lat = coordinates[0][1];
            if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
              return [lng, lat];
            } else {
              console.error('Invalid coordinates:', lng, lat);
              return null;
            }
          } else {
            console.error('Invalid coordinates:', coordinates);
            return null;
          }
        } else if (feature.geometry.type === 'Polygon') {
          const coordinates = feature.geometry.coordinates[0];
          if (coordinates.length > 0) {
            const lng = coordinates[0][0];
            const lat = coordinates[0][1];
            if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
              return [lng, lat];
            } else {
              console.error('Invalid coordinates:', lng, lat);
              return null;
            }
          } else {
            console.error('Invalid coordinates:', coordinates);
            return null;
          }
        }
      });
    } else {
      console.error('Invalid GeoJSON:', geojson);
      return null;
    }
  } catch (error) {
    console.error('Error parsing GeoJSON:', error.message);
    return null;
  }
},
    // Implement getKMLCoordinates and getTIFFCoordinates methods as needed
    showAlert(message) {
      alert(message); // Basic alert for simplicity; you can customize this with a modal or toast library
    },
  },
};
</script>

<style>
.map-container {
  height: 800px;
  border: 1px solid #ccc;
}
.btn-upload {
  padding: 8px 16px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}
.btn-upload:hover {
  background-color: #0056b3;
}
</style>
