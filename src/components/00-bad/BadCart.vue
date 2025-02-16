<script setup lang="ts">
import { ref } from "vue";
import type { CartItem } from "@/types";

const api = {
  addItem: (_: any) => Promise.resolve(),
};

// ACTUAL CODE BELOW
const isLoading = ref(false);
const isError = ref(false);
const items = ref<CartItem[]>([]);
const isCheckingOut = ref(false);

const addToCart = async (product: CartItem) => {
  isLoading.value = true;
  isError.value = false;
  try {
    await api.addItem(product);
    items.value.push(product);
  } catch (e) {
    isError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Show invalid states possible:
console.log(isLoading.value && isCheckingOut.value); // Can be true!
console.log(isError.value && isCheckingOut.value); // Can be true!

// IGNORE - DEMO
addToCart({ id: 1, name: "Product 1" } as any);
</script>
