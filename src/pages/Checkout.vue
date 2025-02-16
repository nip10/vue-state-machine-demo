<script setup lang="ts">
import { useCart } from "../composables/useCart";
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";
import { watch } from "vue";

const router = useRouter();
const { state, total, checkout, error } = useCart();

watch(
  () => state.value,
  (newState) => {
    if (newState === "checkoutSuccess") {
      router.push("/success");
    }
  }
);
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>

    <div class="max-w-md mx-auto">
      <div class="border rounded p-4 mb-6">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        <div class="flex justify-between mb-4">
          <span>Total:</span>
          <span class="font-semibold">${{ total.toFixed(2) }}</span>
        </div>
      </div>

      <div
        v-if="error"
        class="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        {{ error }}
      </div>

      <Button
        @click="checkout"
        :disabled="state === 'checkingOut'"
        class="w-full"
      >
        {{ state === "checkingOut" ? "Processing..." : "Complete Order" }}
      </Button>
    </div>
  </div>
</template>
