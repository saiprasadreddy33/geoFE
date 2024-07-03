<template>
  <l-map :zoom="zoom" :center="center" style="height: 800px;">
    <l-tile-layer :url="url"></l-tile-layer>
    <template v-for="file in filesWithCoordinates" :key="file.filename">
      <l-marker v-if="isMarker(file)" :lat-lng="getCoordinates(file)">
        <l-popup>
          <div>
            <h4>{{ file.filename }}</h4>
            <p>{{ file.mimetype }}</p>
            <p>{{ file.size }} bytes</p>
          </div>
        </l-popup>
      </l-marker>
      <l-geo-json v-else :geojson="parseGeoJSON(file.content)">
        <l-popup>
          <div>
            <h4>{{ file.filename }}</h4>
            <p>{{ file.mimetype }}</p>
            <p>{{ file.size }} bytes</p>
          </div>
        </l-popup>
      </l-geo-json>
    </template>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup, LGeoJson } from 'vue3-leaflet';
import 'leaflet/dist/leaflet.css';
import * as omnivore from 'leaflet-omnivore';
import 'leaflet-omnivore/leaflet-omnivore.js';
import GeoTIFF from 'geotiff';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LGeoJson,
  },
  props: {
    files: {
      type: Array,
      required: true,
    },
  },
  data() {
    /*return {
      zoom: 2,
      center: [0, 0],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    };*/
  },
  computed: {
    filesWithCoordinates() {
      return this.files.filter(file => this.getCoordinates(file) !== null);
    },
  },
  methods: {
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
        if (geojson.features && geojson.features.length > 0) {
          const coords = geojson.features[0].geometry.coordinates;
          return Array.isArray(coords[0]) ? coords[0].reverse() : coords.reverse();
        }
      } catch (error) {
        console.error('Error parsing GeoJSON:', error.message);
      }
      return null;
    },
    getKMLCoordinates(file) {
      try {
        const kml = omnivore.kml.parse(file.content);
        if (kml && kml._layers) {
          for (const key in kml._layers) {
            if (kml._layers[key]._latlng) {
              return [kml._layers[key]._latlng.lat, kml._layers[key]._latlng.lng];
            }
          }
        }
      } catch (error) {
        console.error('Error parsing KML:', error.message);
      }
      return null;
    },
    async getTIFFCoordinates(file) {
      try {
        const tiff = await GeoTIFF.fromArrayBuffer(this.b64toArrayBuffer(file.content));
        const image = await tiff.getImage();
        const tiepoint = image.getTiePoints()[0];
        const pixelScale = image.getFileDirectory().ModelPixelScale;

        const x = tiepoint.x + (image.getWidth() / 2) * pixelScale[0];
        const y = tiepoint.y - (image.getHeight() / 2) * pixelScale[1];

        return [y, x];
      } catch (error) {
        console.error('Error parsing TIFF:', error.message);
      }
      return null;
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
    isMarker(file) {
      const ext = file.filename.split('.').pop().toLowerCase();
      return ['geojson', 'json'].includes(ext);
    },
    parseGeoJSON(content) {
      return JSON.parse(content);
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles for your Leaflet map component */
</style>
