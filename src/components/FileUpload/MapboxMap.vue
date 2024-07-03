<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import * as omnivore from 'leaflet-omnivore';
//import GeoTIFF from 'geotiff';

export default {
  props: {
    files: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: null,
    };
  },
  watch: {
    files: {
      handler: 'updateMap',
      immediate: true,
    },
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xvd3JpZSIsImEiOiJja21wMHpnMnIwYzM5Mm90OWFqaTlyejhuIn0.TXE-FIaqF4K_K1OirvD0wQ';
    this.map = new mapboxgl.Map({
      container: this.$refs.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2,
      pitch: 60, // For 3D effect
    });

    this.map.on('load', () => {
      this.updateMap();
    });
  },
  methods: {
    updateMap() {
      if (!this.map) return;

      // Remove existing sources and layers
      const existingSources = this.map.getStyle().sources;
      Object.keys(existingSources).forEach(sourceId => {
        if (sourceId.startsWith('uploaded-')) {
          this.map.removeSource(sourceId);
        }
      });

      const existingLayers = this.map.getStyle().layers;
      existingLayers.forEach(layer => {
        if (layer.id.startsWith('uploaded-')) {
          this.map.removeLayer(layer.id);
        }
      });

      this.files.forEach(file => {
        const ext = file.filename.split('.').pop().toLowerCase();
        switch (ext) {
          case 'geojson':
          case 'json':
            this.addGeoJSONLayer(file);
            break;
          case 'kml':
            this.addKMLLayer(file);
            break;
          case 'tiff':
            this.addTIFFLayer(file);
            break;
          default:
            console.error('Unsupported file format');
        }
      });
    },
    addGeoJSONLayer(file) {
      const geojson = JSON.parse(file.content);

      this.map.addSource(`uploaded-${file.filename}`, {
        type: 'geojson',
        data: geojson,
      });

      this.map.addLayer({
        id: `uploaded-${file.filename}`,
        type: 'fill-extrusion', // 3D effect
        source: `uploaded-${file.filename}`,
        paint: {
          'fill-extrusion-color': '#888888',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'base_height']
          ],
          'fill-extrusion-opacity': 0.6,
        },
      });

      this.map.on('mousemove', `uploaded-${file.filename}`, e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [`uploaded-${file.filename}`]
        });
        if (features.length) {
          this.map.getCanvas().style.cursor = 'pointer';
          const coordinates = features[0].geometry.coordinates.slice();
          const description = `
            <h4>${file.filename}</h4>
            <p>${file.mimetype}</p>
            <p>${file.size} bytes</p>
          `;
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(this.map);
        } else {
          this.map.getCanvas().style.cursor = '';
        }
      });
    },
    addKMLLayer(file) {
      const kml = omnivore.kml.parse(file.content);
      const geojson = kml.toGeoJSON();

      this.map.addSource(`uploaded-${file.filename}`, {
        type: 'geojson',
        data: geojson,
      });

      this.map.addLayer({
        id: `uploaded-${file.filename}`,
        type: 'line',
        source: `uploaded-${file.filename}`,
        paint: {
          'line-color': '#888888',
          'line-width': 2,
        },
      });

      this.map.on('mousemove', `uploaded-${file.filename}`, e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [`uploaded-${file.filename}`]
        });
        if (features.length) {
          this.map.getCanvas().style.cursor = 'pointer';
          const coordinates = features[0].geometry.coordinates.slice();
          const description = `
            <h4>${file.filename}</h4>
            <p>${file.mimetype}</p>
            <p>${file.size} bytes</p>
          `;
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(this.map);
        } else {
          this.map.getCanvas().style.cursor = '';
        }
      });
    },
    async addTIFFLayer(file) {
      //const tiff = await GeoTIFF.fromArrayBuffer(this.b64toArrayBuffer(file.content));
      //const image = await tiff.getImage();
      //const [originX, originY] = image.getOrigin();
      //const pixelSize = image.getResolution();

      this.map.addSource(`uploaded-${file.filename}`, {
        type: 'raster',
        tiles: [URL.createObjectURL(file.content)],
        tileSize: 256,
      });

      this.map.addLayer({
        id: `uploaded-${file.filename}`,
        type: 'raster',
        source: `uploaded-${file.filename}`,
        paint: {
          'raster-opacity': 0.85,
        },
      });

      this.map.on('mousemove', `uploaded-${file.filename}`, e => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [`uploaded-${file.filename}`]
        });
        if (features.length) {
          this.map.getCanvas().style.cursor = 'pointer';
          const coordinates = features[0].geometry.coordinates.slice();
          const description = `
            <h4>${file.filename}</h4>
            <p>${file.mimetype}</p>
            <p>${file.size} bytes</p>
          `;
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(this.map);
        } else {
          this.map.getCanvas().style.cursor = '';
        }
      });
    },
    b64toArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 600px;
}
</style>
