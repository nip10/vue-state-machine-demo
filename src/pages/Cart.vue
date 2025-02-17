<script setup lang="ts">
import { useCart } from "@/composables/useCart";
import { Button } from "@/components/ui/button";

const { items, total, removeFromCart, updateQuantity } = useCart();
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Shopping Cart</h1>

    <div v-if="items.length === 0" class="text-center py-8">
      <p class="text-gray-500">Your cart is empty</p>
      <RouterLink to="/">
        <Button class="mt-4"> Continue Shopping </Button>
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center gap-4 p-4 border rounded mb-4"
        >
          <img
            :src="item.image"
            :alt="item.name"
            class="w-24 h-24 object-cover"
          />
          <div class="flex-grow">
            <h3 class="font-semibold">{{ item.name }}</h3>
            <p class="text-gray-600">${{ item.price }}</p>
            <div class="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                @click="updateQuantity(item.id, Math.max(0, item.quantity - 1))"
              >
                -
              </Button>
              <span>{{ item.quantity }}</span>
              <Button
                variant="outline"
                size="sm"
                @click="updateQuantity(item.id, item.quantity + 1)"
              >
                +
              </Button>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            @click="removeFromCart(item.id)"
          >
            Remove
          </Button>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div class="border rounded p-4">
          <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
          <div class="flex justify-between mb-4">
            <span>Total:</span>
            <span class="font-semibold">${{ total.toFixed(2) }}</span>
          </div>
          <RouterLink to="/checkout">
            <Button class="w-full"> Checkout </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
