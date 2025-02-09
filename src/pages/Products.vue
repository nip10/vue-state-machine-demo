<script setup lang="ts">
import { ref } from 'vue';
import { useCart } from '../composables/useCart';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import type { Product } from '../types';

const { addToCart, state } = useCart();

// Mock products data
const products = ref<Product[]>([
  {
    id: 1,
    name: 'Mechanical Keyboard',
    price: 149.99,
    description: 'Cherry MX switches, RGB backlight',
    image: '/api/placeholder/200/200',
  },
  {
    id: 2,
    name: 'Ergonomic Mouse',
    price: 79.99,
    description: 'Wireless, adjustable DPI',
    image: '/api/placeholder/200/200',
  },
]);
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Products</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="product in products" :key="product.id">
        <CardHeader>
          <CardTitle>{{ product.name }}</CardTitle>
          <CardDescription>${{ product.price }}</CardDescription>
        </CardHeader>
        <CardContent>
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-48 object-cover mb-4"
          />
          <p>{{ product.description }}</p>
        </CardContent>
        <CardFooter>
          <Button
            @click="addToCart(product)"
            :disabled="state === 'addingItem'"
            class="w-full"
          >
            {{ state === 'addingItem' ? 'Adding...' : 'Add to Cart' }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
