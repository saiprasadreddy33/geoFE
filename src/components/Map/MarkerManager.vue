<template>
  <div class="marker-manager">
    <button @click="addMarker">Add Marker</button>
    <div v-for="(marker, index) in markers" :key="index" class="marker-item">
      <p>Marker {{ index + 1 }}</p>
      <button @click="confirmDeleteMarker(index)" class="delete-button">X</button>
      <button @click="moveMarker(index)">Move</button>
    </div>
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

export default {
  data() {
    return {
      map: null,
      markers: [],
      newMarker: null,
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0aHVyYSIsImEiOiJja3M5N2tzNjQwMjFkMnVvNjJ4NG9oZDJmIn0.aRVi3tfSdQOz1X5hFwWWlQ';
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.9629, 20.5937], // Center of India
      zoom: 4
    });

    // Fetch markers from server on mount
    this.fetchMarkers();

    // Add click event to map to create new marker
    this.map.on('click', (e) => {
      this.addNewMarker(e.lngLat);
    });
  },
  methods: {
    async fetchMarkers() {
      try {
        const response = await axios.get('http://localhost:3000/api/markers');
        this.markers = response.data;
        this.addMarkersToMap();
      } catch (error) {
        console.error('Error fetching markers:', error);
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

      el.addEventListener('click', () => {
        this.selectedMarker = marker;
      });

      mapMarker.on('dragend', async () => {
        const lngLat = mapMarker.getLngLat();
        try {
          await axios.put(`http://localhost:3000/api/markers/${marker._id}`, { location: { coordinates: [lngLat.lng, lngLat.lat] } });
          console.log('Marker moved to:', lngLat);
        } catch (error) {
          console.error('Error updating marker position:', error);
        }
      });
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
          const response = await axios.post('http://localhost:3000/api/markers', newMarker);
          const createdMarker = response.data.marker;
          this.markers.push(createdMarker);
          this.addMarkerToMap(createdMarker);
          this.newMarker.remove();
          this.newMarker = null;
        } catch (error) {
          console.error('Error adding marker:', error);
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
        await axios.delete(`http://localhost:3000/api/markers/${markerToDelete._id}`);
        this.markers.splice(index, 1);
        this.fetchMarkers();
      } catch (error) {
        console.error('Error deleting marker:', error);
      }
    },
    addNewMarker(lngLat) {
      if (this.newMarker) {
        this.newMarker.remove();
      }
      this.newMarker = new mapboxgl.Marker()
        .setLngLat(lngLat)
        .addTo(this.map);

      if (alert('Do you want to save this marker?')) {
        this.addMarker();
      } else {
        this.newMarker.remove();
        this.newMarker = null;
      }
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
          await axios.put(`http://localhost:3000/api/markers/${marker._id}`, { location: { coordinates: [lngLat.lng, lngLat.lat] } });
          console.log('Marker moved to:', lngLat);
          this.markers[index].location.coordinates = [lngLat.lng, lngLat.lat];
        } catch (error) {
          console.error('Error updating marker position:', error);
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
    }
  },
  destroyed() {
    if (this.map) {
      this.map.remove();
    }
  }
};
</script>

<style scoped>
.map {
  height: 400px;
}
.marker {
  background-image: url('@/assets/custom-marker.png');
  background-size: cover;
  width: 30px;
  height: 30px;
}
.marker-item {
  display: flex;
  align-items: center;
}
.delete-button {
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
}
</style>
