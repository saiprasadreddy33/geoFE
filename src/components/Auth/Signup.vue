<template>
  <div class="min-h-screen flex justify-center items-center bg-gray-200">
    <form @submit.prevent="signupUser" class="max-w-md w-full p-6 bg-white rounded shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <!-- Display error message -->
      <div v-if="errorMessage" class="mb-4 text-red-500">
        {{ errorMessage }}
      </div>
      <div class="mb-4">
        <label for="username" class="block text-gray-700 font-bold mb-2">Username</label>
        <input id="username" type="text" v-model="username" class="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
        <input id="email" type="email" v-model="email" class="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-4">
        <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
        <input id="password" type="password" v-model="password" class="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-6">
        <label for="confirmPassword" class="block text-gray-700 font-bold mb-2">Confirm Password</label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" class="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="flex justify-between">
        <router-link to="/login" class="text-blue-500 hover:text-blue-800">Already have an account? Log in</router-link>
        <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign Up</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignupPage',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '' // New state to hold error message
    };
  },
  methods: {
    async signupUser() {
      try {
        const response = await axios.post('https://geobe.onrender.com/api/auth/signup', {
          username: this.username,
          email: this.email,
          password: this.password
        });

        // Store token in localStorage or Vuex for authentication
        localStorage.setItem('token', response.data.token);

        // Redirect to dashboard or any other route
        this.$router.push('/dashboard');

      } catch (error) {
        console.error('Error signing up:', error.response.data);
        if (error.response.status === 400) {
          this.errorMessage = error.response.data.message; // Display specific error message
        } else {
          this.errorMessage = 'Signup failed. Please check your information and try again.';
        }
      }
    }
  }
};
</script>

<style>
/* Optional styles for the signup page */
</style>
