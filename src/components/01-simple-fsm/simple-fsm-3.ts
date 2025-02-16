// DEMO SETUP - IGNORE
import { computed, ref } from "vue";
const api = {
  async addItem(_: Product) {},
};

/**
 *  TYPES
 **/
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

type CartState = "idle" | "addingItem" | "error" | "checkingOut";

type CartEvent =
  | { type: "ADD_ITEM"; item: Product }
  | { type: "SUCCESS" }
  | { type: "ERROR" };

/**
 *  THE ACTUAL MACHINE IMPLEMENTATION
 **/
class CartMachine {
  state: CartState = "idle";
  items: Product[] = [];

  dispatch(event: CartEvent) {
    switch (this.state) {
      case "idle":
        if (event.type === "ADD_ITEM") {
          this.state = "addingItem";
          return;
        }
        break;

      case "addingItem":
        if (event.type === "SUCCESS") {
          // @ts-ignore
          this.items.push(event.item);
          this.state = "idle";
          return;
        }
        if (event.type === "ERROR") {
          this.state = "error";
          return;
        }
        break;
    }
  }
}

/**
 *  COMPOSABLE THAT USES THE MACHINE
 **/
export function useCart() {
  const machine = ref(new CartMachine());

  return {
    state: computed(() => machine.value.state),
    items: computed(() => machine.value.items),
    addItem: async (product: Product) => {
      machine.value.dispatch({ type: "ADD_ITEM", item: product });
      try {
        await api.addItem(product);
        machine.value.dispatch({ type: "SUCCESS" });
      } catch {
        machine.value.dispatch({ type: "ERROR" });
      }
    },
  };
}
