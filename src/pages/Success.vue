<script setup lang="ts">
import { onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { CheckCircle } from "lucide-vue-next";
import { vConfetti } from "@neoconfetti/vue";
import { Button } from "@/components/ui/button";
import { useCart } from "@/composables/useCart";

const { reset } = useCart();

onUnmounted(() => {
  // Reset state machine
  reset();
});
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="text-center space-y-6 max-w-md mx-auto p-8">
      <!-- Success Icon -->
      <div
        class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle class="h-10 w-10 text-green-600" />
        <div v-confetti />
      </div>

      <!-- Message -->
      <h1 class="text-2xl font-bold">Order Complete!</h1>
      <p class="text-gray-600">Thank you for your purchase</p>

      <!-- Action Button -->
      <RouterLink to="/">
        <Button class="mt-8"> Continue Shopping </Button>
      </RouterLink>
    </div>
  </div>
</template>
