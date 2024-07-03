<template>
  <div class="min-h-screen bg-cover bg-center" :style="{ backgroundImage: 'url()' }">
    <div class="bg-gray-800 bg-opacity-60 min-h-screen flex flex-col justify-center items-center px-4">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4 animate-fadeIn">Welcome to the Geospatial App</h1>
        <p class="text-xl text-gray-300 animate-fadeIn">Manage and visualize your geospatial data with ease.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <!-- Login Card -->
        <div class="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105 duration-300">
          <div class="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-12 h-12 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5.121 19.121a3 3 0 010-4.242l1.415-1.415a3 3 0 014.242 0L12 14.586l1.121-1.121a3 3 0 014.242 0l1.415 1.415a3 3 0 010 4.242L19.121 21a3 3 0 01-4.242 0L12 18.586l-1.121 1.121a3 3 0 01-4.242 0l-1.415-1.415a3 3 0 010-4.242L5.121 19.121z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-center mb-6">Existing User?</h2>
          <p class="text-center mb-6">If you already have an account, log in to access the dashboard and manage your data.</p>
          <router-link
            :to="{ name: 'Login' }"
            class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mx-auto text-center transition-colors duration-300">
            Log In
          </router-link>
        </div>

        <!-- Signup Card -->
        <div class="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105 duration-300">
          <div class="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="w-12 h-12 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2h-12a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-center mb-6">New User?</h2>
          <p class="text-center mb-6">Sign up to create an account and start managing your geospatial data today.</p>
          <router-link
            :to="{ name: 'Signup' }"
            class="block bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded mx-auto text-center transition-colors duration-300">
            Sign Up
          </router-link>
        </div>
      </div>

      <!-- Additional Information Section -->
      <div class="mt-12 w-full max-w-4xl">
        <div class="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105 duration-300">
          <h2 class="text-4xl font-bold mb-6 text-center text-gray-800">Application Overview</h2>
          <p class="text-lg leading-relaxed mb-6 text-gray-700">Our Geospatial App allows you to upload, visualize, and manage geospatial data. You can create markers, draw shapes, measure distances, and more. This platform is designed to make your geospatial data management tasks easier and more efficient.</p>
          <p class="text-lg leading-relaxed mb-6 text-gray-700">To get started, please log in if you already have an account, or sign up if you're new to the platform. Once logged in, you will have access to the dashboard, where you can upload your geospatial files, manage markers, shapes, and utilize all the powerful features our app offers.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 2s ease-in-out;
}

.bg-cover {
  background-size: cover;
}

.bg-center {
  background-position: center;
}

.min-h-screen {
  min-height: 100vh;
}
</style>
