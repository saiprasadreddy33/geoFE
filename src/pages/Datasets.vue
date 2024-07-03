<template>
    <div>
      <h2 class="text-2xl font-bold mb-4">Manage Datasets</h2>
  
      <!-- Dataset list with show/hide toggle -->
      <div v-for="dataset in datasets" :key="dataset._id" class="bg-white rounded-md shadow p-4 mb-4">
        <div class="flex justify-between items-center mb-2">
          <div>
            <span class="font-bold">{{ dataset.name }}</span>
            <span class="text-gray-500"> - Created: {{ formatDateTime(dataset.createdAt) }}</span>
          </div>
          <div>
            <label class="inline-flex items-center">
              <input type="checkbox" v-model="dataset.visible" @change="updateDatasetVisibility(dataset)">
              <span class="ml-2">Visible</span>
            </label>
          </div>
        </div>
        <div class="text-gray-700">{{ dataset.description }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ManageDatasets',
    data() {
      return {
        datasets: [],
      };
    },
    mounted() {
      this.fetchDatasets();
    },
    methods: {
      async fetchDatasets() {
        try {
          const response = await axios.get('/api/datasets');
          this.datasets = response.data;
        } catch (error) {
          console.error('Error fetching datasets:', error.message);
        }
      },
      async updateDatasetVisibility(dataset) {
        try {
          await axios.put(`/api/datasets/${dataset._id}`, dataset);
          // Optionally update local state or display success message
        } catch (error) {
          console.error('Error updating dataset visibility:', error.message);
        }
      },
      formatDateTime(datetime) {
        return new Date(datetime).toLocaleString();
      }
    },
  };
  </script>
  
  <style scoped>
  /* Scoped styles */
  /* Add scoped styles here */
  </style>
  