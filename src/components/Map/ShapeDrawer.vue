<template>
  <div class="shape-drawer">
    <button @click="toggleDrawing">{{ drawing ? 'Stop Drawing' : 'Start Drawing' }}</button>
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export default {
  data() {
    return {
      map: null,
      draw: null,
      drawing: false
    };
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXJ0aHVyYSIsImEiOiJja3M5N2tzNjQwMjFkMnVvNjJ4NG9oZDJmIn0.aRVi3tfSdQOz1X5hFwWWlQ';
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [20.5937, 78.9629],
      zoom: 2
    });

    this.draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });
  },
  methods: {
    toggleDrawing() {
      if (!this.drawing) {
        this.startDrawing();
      } else {
        this.stopDrawing();
      }
      this.drawing = !this.drawing;
    },
    startDrawing() {
      this.map.addControl(this.draw);
    },
    stopDrawing() {
      this.map.removeControl(this.draw);
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
.map {
  height: 400px;
}
</style>
