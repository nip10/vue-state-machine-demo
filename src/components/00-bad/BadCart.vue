<script setup lang="ts">
const isLoading = ref(false);
const isError = ref(false);
const items = ref<CartItem[]>([]);
const isCheckingOut = ref(false);

const addToCart = async (product: Product) => {
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
</script>
