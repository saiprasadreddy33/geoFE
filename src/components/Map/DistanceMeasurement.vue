<template>
  <div class="distance-measurement">
    <div>
      <button @click="toggleMeasurementMode">
        {{ measuring ? 'Stop Measuring' : 'Start Measuring' }}
      </button>
      <div v-if="distance">
        <p>Distance: {{ distance.km.toFixed(2) }} km ({{ distance.mi.toFixed(2) }} mi)</p>
      </div>
    </div>
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  data() {
    return {
      map: null,
      measuring: false,
      distance: null,
      line: null
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0aHVyYSIsImEiOiJja3M5N2tzNjQwMjFkMnVvNjJ4NG9oZDJmIn0.aRVi3tfSdQOz1X5hFwWWlQ';
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2
    });
  },
  methods: {
    toggleMeasurementMode() {
      if (!this.measuring) {
        this.startMeasurement();
      } else {
        this.stopMeasurement();
      }
      this.measuring = !this.measuring;
    },
    startMeasurement() {
      this.distance = null;
      this.line = new mapboxgl.Draw({
        displayControlsDefault: false,
        controls: {
          line_string: true,
          trash: true
        }
      });
      this.map.addControl(this.line);

      this.map.on('draw.create', this.handleDrawCreate);
    },
    handleDrawCreate(event) {
      const line = event.features[0];
      const distance = this.calculateDistance(line.geometry.coordinates);
      this.distance = distance;
    },
    calculateDistance(coordinates) {
      const line = turf.lineString(coordinates);
      const lengthInKm = turf.length(line, { units: 'kilometers' });
      const lengthInMi = turf.length(line, { units: 'miles' });
      return {
        km: lengthInKm,
        mi: lengthInMi
      };
    },
    stopMeasurement() {
      this.map.removeControl(this.line);
      this.line = null;
      this.map.off('draw.create', this.handleDrawCreate);
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
</style>
