<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, RouterLink } from 'vue-router';
import { useCart } from './composables/useCart';
import { Button } from './components/ui/button';

const { items, state } = useCart();
const itemCount = computed(() => items.value.length);
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <header class="bg-white shadow mb-8">
      <nav class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <RouterLink
            to="/"
            class="font-bold text-xl hover:text-gray-700 transition-colors"
          >
            FSM Shop
          </RouterLink>

          <div class="flex items-center gap-4">
            <RouterLink
              to="/"
              class="hover:text-gray-700 transition-colors"
              :class="{ 'text-gray-900 font-medium': $route.path === '/' }"
            >
              Products
            </RouterLink>

            <RouterLink
              to="/cart"
              class="relative hover:text-gray-700 transition-colors"
              :class="{ 'text-gray-900 font-medium': $route.path === '/cart' }"
            >
              Cart
              <span
                v-if="itemCount > 0"
                class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ itemCount }}
              </span>
            </RouterLink>

            <div v-if="state === 'error'" class="text-red-500 text-sm">
              An error occurred
            </div>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="mt-auto py-8 bg-white border-t">
      <div class="container mx-auto px-4 text-center text-gray-600">
        Demo app showcasing Finite State Machines in Vue
      </div>
    </footer>
  </div>
</template>
