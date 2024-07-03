<template>
  <div class="container mx-auto p-4 flex">
    <!-- Left side (Upload Files) -->
    <div class="w-2/3 pr-4">
      <div class="mb-4">
        <nav>
          <!-- Upload Files Tab -->
          <router-link
            to="/file-uploader"
            class="block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            :class="{ 'bg-blue-600': $route.path === '/file-uploader' }"
          >
            Upload Files
          </router-link>

          <!-- Manage Datasets Tab -->
          <!-- Uncomment and adjust as needed -->
          <!-- <router-link
            to="/datasets"
            class="block px-4 py-2 mt-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            :class="{ 'bg-gray-400': $route.path === '/datasets' }"
          >
            Manage Datasets
          </router-link> -->
        </nav>
      </div>
    </div>

    <!-- Right side (View Map) -->
    <div class="w-2/3 pr-4">
      <div class="mb-4">
        <!-- View Map Tab -->
        <router-link
          to="/map"
          class="block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          :class="{ 'bg-blue-600': $route.name === 'Map' }"
        >
          View Map
        </router-link>
      </div>

      <!-- Map Component or Placeholder <router-link
          to="/map"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded-t-lg hover:bg-gray-400"
          :class="{ 'bg-gray-400': $route.name === 'Map' }"
        >
          View Map
        </router-link> -->
    </div>
  </div>

  <!-- Map Display Area -->
  <div class="bg-gray-100 h-64 flex items-center justify-center">
    <p class="text-gray-500">Map Display Area</p>
  </div>

  <!-- File Information Section -->
  <div class="mt-4 p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-lg font-semibold mb-2">File Information</h2>
    <ul>
      <!-- Replace with dynamic content for each uploaded file -->
      <li class="py-2 border-b border-gray-200">
        <p class="text-gray-700">Uploaded GeoJSON files. KML and TIFF files can be rendered on a map using Mapbox.</p>
        <p class="text-gray-500">Files can be shown/hidden according to preferences.</p>
        <!-- Add more details as needed -->
      </li>
      <!-- Repeat for each uploaded file -->
    </ul>
  </div>

  <!-- Link to Dashboard Page -->
  <router-link to="/dashboard" class="block mt-4 text-blue-500 hover:text-blue-700 font-bold px-4">
    Dashboard
  </router-link>
</template>

<script>
export default {
  name: 'UploadPage',
};
</script>

<style scoped>
/* Scoped styles for UploadPage.vue */
/* Add any specific scoped styles here */

/* Example hover effect for mini card */
ul li:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
