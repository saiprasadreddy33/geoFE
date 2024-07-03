<template>
  <div class="hover-card" v-if="hoveredFeature">
    <h3>{{ hoveredFeature.properties.name }}</h3>
    <p>{{ hoveredFeature.properties.description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    hoveredFeature: Object
  }
};
</script>

<style scoped>
.hover-card {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: white;
  padding: 10px;
  border: 1px solid #ccc;
}
</style>
