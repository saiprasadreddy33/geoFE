<template>
  <section class="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full mx-4 md:mx-auto">
      <div class="p-6 md:p-8 space-y-4">
        <h1 class="text-xl md:text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
          Sign in to your account
        </h1>
        <form @submit.prevent="loginUser" class="space-y-4">
          <p v-if="errorMessage" class="text-center text-red-600">{{ errorMessage }}</p>
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <i class="far fa-envelope mr-2"></i>
              Email
            </label>
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              class="input-field"
              placeholder="Your Email"
              required
            />
          </div>
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              <i class="fas fa-lock mr-2"></i>
              Password
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                name="password"
                id="password"
                class="input-field"
                placeholder="••••••••"
                required
              />
              <span @click="togglePasswordVisibility" class="toggle-password">
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <router-link to="/forgot-password" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
              Forgot password?
            </router-link>
          </div>
          <button type="submit" class="btn-primary w-full mt-4">
            Sign in
          </button>
          <p class="text-center text-sm font-light text-gray-500 dark:text-gray-400">
            Don’t have an account yet?
            <router-link to="/signup" class="font-medium text-primary-600 hover:underline dark:text-primary-500 ml-1">
              Sign up
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      showPassword: false,
      errorMessage: '',
      email: '',
      password: '',
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async loginUser() {
      try {
        const response = await axios.post('https://geobe.onrender.com/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Error logging in:', error.response.data);
        if (error.response.status === 404 || error.response.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      }
    },
  },
};
</script>

<style scoped>
.input-field {
  @apply bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500;
}

.toggle-password {
  @apply absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none text-gray-500 cursor-pointer dark:text-gray-400 ml-2;
}

.btn-primary {
  @apply w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800;
}
</style>

