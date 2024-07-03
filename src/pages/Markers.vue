<template>
  <div class="marker-manager">
    <button @click="redirectToDashboard" class="redirect-button">Go to Dashboard</button>
    <button @click="promptAddMarker" class="add-button">Add Marker</button>
    <div v-for="(marker, index) in markers" :key="index" class="marker-item">
      <p>Marker {{ index + 1 }}</p>
      <button @click="confirmDeleteMarker(index)" class="delete-button">Delete</button>
      <button @click="moveMarker(index)" class="move-button">Move</button>
      <div v-if="showAlert" class="alert-container">
        <div class="alert-box">
          <p>{{ alertMessage }}</p>
          <button class="close-button" @click="closeAlert">Close</button>
        </div>
      </div>
    </div>
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

export default {
  name: 'MarkerManager',
  data() {
    return {
      map: null,
      markers: [],
      newMarker: null,
      showAlert: false,
      alertMessage: ''
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xvd3JpZSIsImEiOiJja21wMHpnMnIwYzM5Mm90OWFqaTlyejhuIn0.TXE-FIaqF4K_K1OirvD0wQ';
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.9629, 20.5937], // Center of India
      zoom: 4
    });

    this.fetchMarkers();

    this.map.on('click', (e) => {
      this.addNewMarker(e.lngLat);
    });
  },
  methods: {
    redirectToDashboard() {
      this.$router.push('/dashboard');
    },
    async fetchMarkers() {
      try {
        const response = await axios.get('https://geobe.onrender.com/api/markers');
        this.markers = response.data;
        this.addMarkersToMap();
      } catch (error) {
        console.error('Error fetching markers:', error);
        this.showCustomAlert('Error fetching markers!');
      }
    },
    addMarkersToMap() {
      this.markers.forEach(marker => {
        this.createMarkerOnMap(marker);
      });
    },
    createMarkerOnMap(marker) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${require('@/assets/custom-marker.png')})`;
      el.style.backgroundSize = 'cover';
      el.style.width = '30px';
      el.style.height = '30px';

      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat(marker.location.coordinates)
        .addTo(this.map)
        .setDraggable(true);

      mapMarker.on('dragend', async () => {
        const lngLat = mapMarker.getLngLat();
        try {
          await axios.put(`https://geobe.onrender.com/api/markers/${marker._id}`, {
            name: marker.name,
            location: {
              type: 'Point',
              coordinates: [lngLat.lng, lngLat.lat]
            }
          });
          this.showCustomAlert(`Marker moved to: [${lngLat.lng}, ${lngLat.lat}]`);
          marker.location.coordinates = [lngLat.lng, lngLat.lat];
        } catch (error) {
          console.error('Error updating marker position:', error);
          this.showCustomAlert('Error updating marker position!');
        }
      });
    },
    promptAddMarker() {
      alert('Click on the map to add a new marker.');
    },
    async addMarker() {
      if (this.newMarker) {
        const coordinates = this.newMarker.getLngLat();
        const newMarker = {
          name: `Marker ${this.markers.length + 1}`,
          location: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
          }
        };

        try {
          const response = await axios.post('https://geobe.onrender.com/api/markers', newMarker);
          const createdMarker = response.data.marker;
          this.markers.push(createdMarker);
          this.addMarkerToMap(createdMarker);
          this.newMarker.remove();
          this.newMarker = null;
          this.showCustomAlert('Marker added successfully!');
        } catch (error) {
          console.error('Error adding marker:', error);
          this.showCustomAlert('Error adding marker!');
        }
      }
    },
    confirmDeleteMarker(index) {
      if (confirm('Are you sure you want to delete this marker?')) {
        this.deleteMarker(index);
      }
    },
    async deleteMarker(index) {
      const markerToDelete = this.markers[index];
      try {
        await axios.delete(`https://geobe.onrender.com/api/markers/${markerToDelete._id}`);
        this.markers.splice(index, 1);
        this.fetchMarkers();
        this.showCustomAlert('Marker deleted successfully!');
      } catch (error) {
        console.error('Error deleting marker:', error);
        this.showCustomAlert('Error deleting shape. Invalid ID!');
      }
    },
    addNewMarker(lngLat) {
      if (this.newMarker) {
        this.newMarker.remove();
      }
      this.newMarker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(this.map);

      setTimeout(() => {
        if (confirm('Do you want to save this marker?')) {
          this.addMarker();
        } else {
          this.newMarker.remove();
          this.newMarker = null;
          this.showCustomAlert('Marker addition cancelled.');
        }
      }, 100);
    },
    moveMarker(index) {
      const marker = this.markers[index];
      const mapMarker = new mapboxgl.Marker()
        .setLngLat(marker.location.coordinates)
        .addTo(this.map)
        .setDraggable(true);

      mapMarker.on('dragend', async () => {
        const lngLat = mapMarker.getLngLat();
        try {
          await axios.put(`https://geobe.onrender.com/api/markers/${marker._id}`, {
            name: marker.name,
            location: {
              type: 'Point',
              coordinates: [lngLat.lng, lngLat.lat]
            }
          });
          this.showCustomAlert(`Marker moved to: [${lngLat.lng}, ${lngLat.lat}]`);
          this.markers[index].location.coordinates = [lngLat.lng, lngLat.lat];
        } catch (error) {
          console.error('Error updating marker position:', error);
          this.showCustomAlert('Error updating marker position!');
        }
      });
    },
    addMarkerToMap(marker) {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = `url(${require('@/assets/custom-marker.png')})`;
      el.style.backgroundSize = 'cover';
      el.style.width = '30px';
      el.style.height = '30px';

      new mapboxgl.Marker(el)
        .setLngLat(marker.location.coordinates)
        .addTo(this.map)
        .setDraggable(true);
    },
    showCustomAlert(message) {
      this.alertMessage = message;
      this.showAlert = true;
    },
    closeAlert() {
      this.showAlert = false;
    }
  },
  unmounted() {
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>

<style scoped>
.marker-manager {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.redirect-button, .add-button, .delete-button, .move-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.redirect-button:hover {
  background-color: #45a049;
}
.add-button:hover {
  background-color: #45a049;
}
.delete-button {
  background-color: #f44336;
}
.delete-button:hover {
  background-color: #da190b;
}
.move-button {
  background-color: #008CBA;
}
.move-button:hover {
  background-color: #007B9E;
}
.marker-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}
.marker-item p {
  margin: 0;
}
.map {
  height: 400px;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
}
.marker {
  background-image: url('@/assets/custom-marker.png');
  background-size: cover;
  width: 30px;
  height: 30px;
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
@media (max-width: 600px) {
  .marker-item, .map {
    width: 100%;
  }
}
</style>
