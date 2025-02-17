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

export type CartState = "idle" | "addingItem" | "error" | "checkingOut";

export type CartEvent =
  | { type: "ADD_ITEM"; item: Product }
  | { type: "SUCCESS" }
  | { type: "ERROR" };

export type CartContext = {
  items: Product[];
};

/**
 *  THE ACTUAL MACHINE IMPLEMENTATION
 **/
export class CartMachine {
  state: CartState = "idle";
  context: CartContext = {
    items: [],
  };

  private transitions: Record<
    CartState,
    {
      on: {
        [K in CartEvent["type"]]?: {
          target: CartState;
          action?: (context: CartContext, event: CartEvent) => void;
        };
      };
    }
  > = {
    idle: {
      on: {
        ADD_ITEM: {
          target: "addingItem",
        },
      },
    },
    addingItem: {
      on: {
        SUCCESS: {
          target: "idle",
          action: (context, event) => {
            if (event.type === "ADD_ITEM") {
              context.items.push(event.item);
            }
          },
        },
        ERROR: {
          target: "error",
        },
      },
    },
    error: {
      on: {
        ADD_ITEM: {
          target: "addingItem",
        },
      },
    },
    checkingOut: {
      on: {}, // Empty for now
    },
  };

  dispatch(event: CartEvent) {
    const transition = this.transitions[this.state].on[event.type];

    if (transition) {
      this.state = transition.target;
      transition.action?.(this.context, event);
    }
  }
}

/**
 *  COMPOSABLE THAT USES THE MACHINE
 **/
const machine = ref(new CartMachine());

export function useCart() {
  return {
    state: computed(() => machine.value.state),
    items: computed(() => machine.value.context.items),
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
