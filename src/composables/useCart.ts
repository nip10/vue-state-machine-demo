import { ref, computed } from "vue";
import { CartMachine } from "../machines/cartMachine";
import type { Product, CartEvent } from "../types";

// Create a single instance of the machine that persists across components
const machine = ref(new CartMachine());

export function useCart() {
  const state = computed(() => machine.value.state);
  const items = computed(() => machine.value.context.items);
  const total = computed(() => {
    return machine.value.context.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  });

  console.log("machine", machine.value);
  const error = computed(() => machine.value.context.error);

  // Mock API calls
  const mockApi = {
    addItem: async (_: Product) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Simulate random failures
      if (Math.random() > 0.9) {
        throw new Error("Failed to add item");
      }
      return true;
    },
    checkout: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Simulate random failures
      if (Math.random() > 0.8) {
        throw new Error("Checkout failed");
      }
      return true;
    },
  };

  const dispatch = (event: CartEvent) => {
    machine.value.dispatch(event);
  };

  const addToCart = async (product: Product) => {
    dispatch({ type: "ADD_ITEM", item: product });
    try {
      // First, attempt to add the item via the mock API
      await mockApi.addItem(product);

      // Only dispatch SUCCESS if the API call succeeds
      dispatch({ type: "SUCCESS" });
    } catch (e) {
      // If API call fails, dispatch an error without adding the item
      dispatch({
        type: "ERROR",
        message: e instanceof Error ? e.message : "Failed to add item",
      });
    }
  };

  const removeFromCart = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    dispatch({ type: "UPDATE_QUANTITY", id, quantity });
  };

  const checkout = async () => {
    dispatch({ type: "CHECKOUT" });

    try {
      await mockApi.checkout();
      dispatch({ type: "SUCCESS" });
    } catch (e) {
      dispatch({
        type: "ERROR",
        message: e instanceof Error ? e.message : "Checkout failed",
      });
    }
  };

  const reset = () => {
    machine.value = new CartMachine();
  };

  return {
    // State
    state,
    items,
    total,
    error,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    reset,

    // For debugging
    dispatch,
    machine,
  };
}
