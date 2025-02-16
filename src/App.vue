<script setup lang="ts">
import { computed } from "vue";
import { RouterView, RouterLink } from "vue-router";
import { ShoppingCart } from "lucide-vue-next";
import { useCart } from "@/composables/useCart";
import DebugToggle from "@/components/DebugToggle.vue";
import { Toaster } from "@/components/ui/sonner";

const { items, state } = useCart();

const itemCount = computed(() =>
  items.value.reduce((acc, item) => acc + item.quantity, 0)
);
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <header class="bg-white shadow">
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
              class="hover:text-gray-700 transition-colors px-2"
              :class="{ 'text-gray-900 font-medium': $route.path === '/' }"
            >
              Products
            </RouterLink>
            <RouterLink
              to="/cart"
              class="relative hover:text-gray-700 transition-colors inline-flex gap-2 items-center px-2"
              :class="{ 'text-gray-900 font-medium': $route.path === '/cart' }"
            >
              <ShoppingCart class="w-6 h-6" />
              Cart
              <span
                v-if="itemCount > 0"
                class="absolute -top-3 -right-3 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
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

    <main class="flex-1 container mx-auto px-4 py-8">
      <RouterView />
    </main>

    <footer class="bg-white border-t py-4">
      <div class="container mx-auto px-4 text-center text-gray-600">
        Demo app showcasing Finite State Machines in Vue
      </div>
    </footer>

    <!-- Debug Toggle -->
    <DebugToggle />

    <!-- Toast Container -->
    <Toaster
      expand
      rich-colors
      :visible-toasts="5"
      :duration="Infinity"
      close-button
      :toastOptions="{
        unstyled: true,
        classes: {
          toast: 'bg-blue-400',
          title: 'text-red-400',
          description: 'text-red-400',
          actionButton: 'bg-zinc-400',
          cancelButton: 'bg-orange-400',
          closeButton: 'bg-lime-400',
        },
      }"
    />
  </div>
</template>
