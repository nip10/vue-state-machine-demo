import { cartMachine } from "@/machines/cart-machine-xstate";
import type { Product } from "@/types";
import { useMachine } from "@xstate/vue";
import { computed } from "vue";

export function useCart() {
  const { snapshot, send, actorRef } = useMachine(cartMachine);

  // Mock API calls remain the same
  const mockApi = {
    addItem: async (_: Product) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (Math.random() > 0.9) {
        throw new Error("Failed to add item");
      }
      return true;
    },
    checkout: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (Math.random() > 0.8) {
        throw new Error("Checkout failed");
      }
      return true;
    },
  };

  const addToCart = async (product: Product) => {
    send({ type: "ADD_ITEM", item: product });
    try {
      await mockApi.addItem(product);
      send({ type: "SUCCESS" });
    } catch (e) {
      send({
        type: "ERROR",
        message: e instanceof Error ? e.message : "Failed to add item",
      });
    }
  };

  const removeFromCart = (id: number) => {
    send({ type: "REMOVE_ITEM", id });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    send({ type: "UPDATE_QUANTITY", id, quantity });
  };

  const checkout = async () => {
    send({ type: "CHECKOUT" });
    try {
      await mockApi.checkout();
      send({ type: "SUCCESS" });
    } catch (e) {
      send({
        type: "ERROR",
        message: e instanceof Error ? e.message : "Checkout failed",
      });
    }
  };

  return {
    state: computed(() => snapshot.value),
    context: computed(() => snapshot.value.context),
    items: computed(() => snapshot.value.context.items),
    total: computed(() =>
      snapshot.value.context.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    ),
    error: computed(() => snapshot.value.context.error),
    addToCart,
    removeFromCart,
    updateQuantity,
    checkout,
    // For debugging
    send,
    actorRef,
  };
}
