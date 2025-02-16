<script setup lang="ts">
import { useCart } from "../composables/useCart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { products } from "@/lib/data";

const { addToCart, state } = useCart();
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Products</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="product in products" :key="product.id" class="flex flex-col">
        <CardHeader>
          <CardTitle>{{ product.name }}</CardTitle>
          <CardDescription>${{ product.price }}</CardDescription>
        </CardHeader>
        <CardContent class="grow">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-48 object-contain mb-4"
          />
          <p>{{ product.description }}</p>
        </CardContent>
        <CardFooter>
          <Button
            @click="addToCart(product)"
            :disabled="state === 'addingItem'"
            class="w-full"
          >
            {{ state === "addingItem" ? "Adding..." : "Add to Cart" }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
