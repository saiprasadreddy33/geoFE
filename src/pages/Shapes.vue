<template>
  <div class="dashboard-button-container">
    <button class="dashboard-button" @click="navigateToDashboard">Go to Dashboard</button>

  </div>
  <div class="shape-list">
    <h3>Shape List</h3>
    <ul>
      <li v-for="shape in shapes" :key="shape._id">
        {{ shape.type }} - {{ shape.createdAt }}
        
      </li>
    </ul>
  </div>
  <div class="shapes-page">
    <div id="map" class="map"></div>
    <div class="calculation-box">
      <p>Click the map to draw a custom shape or measure distance.</p>
      <div id="calculated-area">Area: {{ calculatedArea }} square meters</div>
      <div id="calculated-distance">Distance: {{ calculatedDistance }} kilometers / {{ calculatedDistanceMiles }} miles</div>
    
    </div>
    
    
    <button class="clear-button" @click="clearDrawing">Clear</button>
    <button class="edit-button" @click="editShape(shape)">Edit</button>
          <button class="delete-button" @click="deleteShape()">Delete</button>
    <div v-if="showAlert" class="alert-container">
      <div class="alert-box">
        <p>{{ alertMessage }}</p>
        <button class="close-button" @click="closeAlert">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import axios from 'axios';

export default {
  name: 'ShapesPage',
  data() {
    return {
      map: null,
      draw: null,
      calculatedArea: '',
      calculatedDistance: '',
      calculatedDistanceMiles: '',
      shapes: [],
      currentShapeId: null,
      showAlert: false,
      alertMessage: ''
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [78.93814165187473, 19.683098522638844],
      zoom: 4
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        line_string: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });

    this.map.addControl(this.draw);
    this.map.on('draw.create', this.onDrawCreate);
    this.map.on('draw.delete', this.onDrawDelete);
    this.map.on('draw.update', this.onDrawUpdate);
    this.map.on('draw.selectionchange', this.updateMeasurements);

    this.fetchShapes();
  },
  methods: {
    async fetchShapes() {
      try {
        const response = await axios.get('https://geobe.onrender.com/api/shapes');
        this.shapes = response.data;
      } catch (error) {
        console.error('Error fetching shapes:', error.message);
        this.showCustomAlert('Error fetching shapes. Please try again later.');
      }
    },
    async saveShape(shape) {
      try {
        const response = await axios.post('https://geobe.onrender.com/api/shapes', shape);
        this.shapes.push(response.data.shape);
        this.showCustomAlert('Shape saved successfully!');
      } catch (error) {
        console.error('Error saving shape:', error.message);
        this.showCustomAlert('Error saving shape. Please try again later.');
      }
    },
    async deleteShape() {

      this.showCustomAlert('Error deleting shape. Invalid ID.');
  },

    editShape(shape) {
  if (shape && shape._id) {
    this.currentShapeId = shape._id;
    this.draw.add({
      type: 'Feature',
      geometry: {
        type: shape.type,
        coordinates: shape.coordinates
      }
    });
  } else {
    this.showCustomAlert('Error editing shape. Please try again later.');
  }
},
    onDrawCreate(event) {
      const shape = this.extractShapeData(event);
      this.saveShape(shape);
      this.updateMeasurements();
    },
    onDrawUpdate(event) {
      const shape = this.extractShapeData(event);
      this.saveShape(shape);
      this.updateMeasurements();
    },
    onDrawDelete(event) {
      const shapeId = event.features[0].id;
      this.deleteShape(shapeId);
      this.updateMeasurements();
    },
    extractShapeData(event) {
      const { features } = event;
      const { type, coordinates } = features[0].geometry;

      return { type, coordinates };
    },
    clearDrawing() {
      this.draw.deleteAll();
      this.calculatedArea = '';
      this.calculatedDistance = '';
      this.calculatedDistanceMiles = '';
      this.showCustomAlert('Drawing cleared successfully!');
      setTimeout(() => {
      window.location.reload();
    }, 1000);
    },
    updateMeasurements() {
      const data = this.draw.getAll();
      if (data.features.length > 0) {
        if (data.features[0].geometry.type === 'Polygon') {
          const area = turf.area(data.features[0]);
          this.calculatedArea = (Math.round(area * 100) / 100).toFixed(2);
        } else if (data.features[0].geometry.type === 'LineString') {
          const line = data.features[0];
          const length = turf.length(line, { units: 'kilometers' });
          this.calculatedDistance = (Math.round(length * 100) / 100).toFixed(2);
          this.calculatedDistanceMiles = (Math.round(length * 62.1371) / 100).toFixed(2);
        }
      } else {
        this.calculatedArea = '';
        this.calculatedDistance = '';
        this.calculatedDistanceMiles = '';
      }
    },
    navigateToDashboard() {
      this.$router.push('/dashboard');
    },
    showCustomAlert(message) {
      this.alertMessage = message;
      this.showAlert = true;
    },
    closeAlert() {
      this.showAlert = false;
    }
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

.map {
  height: 100vh;
  width: 100%;
}

.calculation-box {
  height: 100px;
  width: 200px;
  position: absolute;
  bottom: 40px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 15px;
  text-align: center;
}

p {
  font-family: 'Open Sans';
  margin: 0;
  font-size: 13px;
}
.clear-button {
  background-color: #6c757d;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.clear-button:hover {
  background-color: #5a6268;
}
.shape-list {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
}

.shape-list ul {
  list-style: none;
  padding: 0;
}

.shape-list li {
  margin-bottom: 10px;
}

.edit-button,
.delete-button {
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 3px;
}

.edit-button:hover,
.delete-button:hover {
  background-color: #45a049;
}

.dashboard-button-container {
  position: absolute;
  top: 1px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
}

.dashboard-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.dashboard-button:hover {
  background-color: #0056b3;
}

.alert-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.alert-box {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.alert-box p {
  margin-bottom: 20px;
}

.close-button {
  background-color: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.close-button:hover {
  background-color: #c82333;
}
</style>