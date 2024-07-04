<template>
  <div>
    <router-link :to="{ name: 'Upload' }" class="text-blue-500 hover:text-blue-700 font-bold">Go to Upload Page</router-link>
    <div class="container mx-auto p-4">
      <!-- File upload form -->
      <form @submit.prevent="uploadFile" class="mb-4 flex items-center justify-center space-x-4">
        <input type="file" accept=".geojson,.kml,.tiff,.json" @change="handleFileChange">
        <button type="submit" :disabled="!file" class="btn-upload">Upload File</button>
      </form>

      <!-- Mapbox GL JS map container -->
      <div ref="mapContainer" class="map-container mt-4"></div>

      <!-- List of uploaded files with Save buttons and eye icons -->
      <div v-if="files.length" class="mt-4">
        <h3 class="text-xl font-bold mb-2">Uploaded Files</h3>
        <div v-for="file in files" :key="file.filename" class="flex items-center justify-between mb-2 p-2 border rounded">
          <div class="flex items-center space-x-2">
            <span>{{ file.filename }}</span>
            <span v-if="file.coordinates" class="text-gray-600">[{{ file.coordinates[1] }}, {{ file.coordinates[0] }}]</span>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="saveFile(file)" class="btn-save">Save</button>
            <button @click="toggleVisibility(file)" class="eye-icon">
              <svg v-if="file.visible" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12m-3-3a3 3 0 116 0 3 3 0 01-6 0zM15 9a3 3 0 110 6M2.458 12C3.732 7.943 7.268 5 12 5c4.732 0 8.268 2.943 9.542 7-.136.411-.293.806-.458 1.174C19.733 16.057 16.197 19 12 19c-4.732 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.06 4.24l18 18M3 12c1.667-3.333 4.667-6 9-6 1.144 0 2.234.144 3.25.418M15.212 15.213C14.63 15.82 13.841 16 13 16c-1.657 0-3-1.343-3-3 0-.841.179-1.631.787-2.212M3.09 3.09c-.23-.23-.585-.333-.908-.207-.323.125-.547.425-.61.757L3 12c0 1.11.892 2.011 2.005 2.011l-.002-.022c.143.229.329.439.548.63M21 21.06c-.23.23-.585.333-.908.207-.323-.125-.547-.425-.61-.757L21 12c0-1.11-.892-2.011-2.005-2.011l.002.022c-.143-.229-.329-.439-.548-.63M19.39 19.39c-.23.23-.585.333-.908.207-.323-.125-.547-.425-.61-.757"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

export default {
  data() {
    return {
      file: null,
      files: [],
      map: null,
      markers: []
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xvd3JpZSIsImEiOiJja21wMHpnMnIwYzM5Mm90OWFqaTlyejhuIn0.TXE-FIaqF4K_K1OirvD0wQ';
    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78, 20],
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
        const mimetype = this.file ? this.file.type : 'application/octet-stream';
        const size = this.file ? this.file.size : 0;

        const file = { filename, mimetype, size, content, visible: true };
        file.coordinates = this.getCoordinates(file);

        if (file.coordinates) {
          this.files.push(file);
          this.displayShapes();
        } else {
          this.showAlert(`Invalid file: ${file.filename}. Check file type and content.`);
        }
      };
      reader.readAsText(this.file);
    },
    saveFile(file) {
      // Simulate API call or implement your backend logic here
      console.log('Saving file:', file);
      // Example API call
      axios.post('https://geobe.onrender.com/api/upload', {
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        content: file.content
      })
        .then(response => {
          console.log('File saved successfully:', response.data);
          this.showAlert(`File ${file.filename} saved successfully!`);
        })
        .catch(error => {
          console.error('Error saving file:', error.message);
          this.showAlert(`Error saving file: ${error.message}`);
        });
    },
    toggleVisibility(file) {
      file.visible = !file.visible;
      this.toggleMarkersVisibility();
    },
    displayShapes() {
      this.markers.forEach(marker => marker.remove());
      this.files.forEach(file => {
        if (file.visible && file.content) {
          const geojson = JSON.parse(file.content);
          if (geojson.type === 'FeatureCollection') {
            geojson.features.forEach(feature => {
              this.addShape(feature);
            });
          } else if (geojson.type === 'Feature') {
            this.addShape(geojson);
          }
        }
      });
    },
    addShape(feature) {
  const geometry = feature.geometry;
  const properties = feature.properties || {};
  let shape;

  switch (geometry.type) {
    case 'Point':
      // eslint-disable-next-line
      const coordinates = geometry.coordinates;
      shape = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h4>${properties.name || 'Point'}</h4>
          <p>Coordinates: ${coordinates[1]}, ${coordinates[0]}</p>
        `))
        .addTo(this.map);
      break;
    case 'Polygon':
      // eslint-disable-next-line
      const polygonCoordinates = geometry.coordinates[0]; // Extract outer ring coordinates
      // eslint-disable-next-line
      const center = this.calculatePolygonCenter(polygonCoordinates);
      // eslint-disable-next-line
      shape = new mapboxgl.Popup().setLngLat(center)
        .setHTML(`<h4>${properties.name || 'Polygon'}</h4>`)
        .addTo(this.map);
      break;
    default:
      console.warn('Unsupported geometry type:', geometry.type);
      break;
  }

  if (shape) {
    this.markers.push(shape);
  }
},
calculatePolygonCenter(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 3) {
    return null;
  }

  // Calculate centroid (approximation for center)
  const centroid = coordinates.reduce((acc, curr) => [acc[0] + curr[0], acc[1] + curr[1]], [0, 0]);
  const numPoints = coordinates.length;
  return [centroid[0] / numPoints, centroid[1] / numPoints];
},

    toggleMarkersVisibility() {
      this.markers.forEach(marker => marker.remove());
      this.displayShapes();
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
          break;
      }

      return coordinates;
    },
    getGeoJSONCoordinates(file) {
      try {
        const geojson = JSON.parse(file.content);
        if (geojson && geojson.features && geojson.features.length > 0) {
          const feature = geojson.features[0];
          if (feature.geometry && feature.geometry.coordinates) {
            return feature.geometry.coordinates;
          }
        }
      } catch (error) {
        console.error('Error parsing GeoJSON:', error);
      }
      return null;
    },
    getKMLCoordinates(file) {
      try {
        const parser = new DOMParser();
        const kml = parser.parseFromString(file.content, 'application/xml');
        const placemarks = kml.getElementsByTagName('Placemark');

        for (const placemark of placemarks) {
          const point = placemark.getElementsByTagName('Point')[0];
          if (point) {
            const coordinates = point.getElementsByTagName('coordinates')[0].textContent.trim();
            const [lng, lat] = coordinates.split(',').map(Number);

            if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
              return [lng, lat];
            } else {
              console.error('Invalid coordinates:', lng, lat);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing KML:', error.message);
      }

      return null;
    },
    getTIFFCoordinates() {
      // Implement TIFF coordinate extraction logic
      return null;
    },
    showAlert(message) {
      alert(message);
    }
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>

<style scoped>
/* Add your scoped styles here */
.btn-upload {
  padding: 0.5rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}
.btn-save {
  padding: 0.5rem 1rem;
  background-color: #2196f3;
  color: white;
  border: none;
  cursor: pointer;
}
.eye-icon {
  cursor: pointer;
}
.map-container {
  height: 400px;
  border: 1px solid #ccc;
}
</style>
