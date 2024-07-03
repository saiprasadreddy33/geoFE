<template>
  <div class="map-container">
    <div ref="map" class="map"></div>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';

export default {
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibHhuZHJrcHAiLCJhIjoiY2p1NWl6OGZsMTU3dDQ0bnI1YnV6YjBkNiJ9.ySV4AyiDcNZmzd9ASRyvRw';
    this.map = new mapboxgl.Map({
      container: this.$refs.map,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [82, 23], // Center the map on India
      zoom: 3
    });

    // Example: Add a marker
    new mapboxgl.Marker().setLngLat([78, 20]).addTo(this.map);

    // Example: Add a GeoJSON data layer
    this.map.on('load', () => {
      this.map.addSource('my-data', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [78, 20]
              },
              properties: {
                title: 'Mapbox Marker',
                description: 'This is a Mapbox marker'
              }
            }
          ]
        }
      });

      this.map.addLayer({
        id: 'my-layer',
        type: 'symbol',
        source: 'my-data',
        layout: {
          'icon-image': 'marker-15',
          'icon-size': 2.5,
          'text-field': ['get', 'title'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [1,1], // Adjust the text offset to center it over the marker
          'text-anchor': 'top'
        }
      });
    });
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
