import { setup, assign } from "xstate";
import type { CartItem, Product } from "../types";

type CartEvent =
  | { type: "ADD_ITEM"; item: Product }
  | { type: "SUCCESS" }
  | { type: "ERROR"; message: string }
  | { type: "REMOVE_ITEM"; id: number }
  | { type: "UPDATE_QUANTITY"; id: number; quantity: number }
  | { type: "CHECKOUT" }
  | { type: "RETRY" };

interface CartContext {
  items: CartItem[];
  pendingItem?: CartItem;
  error?: string;
}

export const cartMachine = setup({
  types: {
    context: {} as CartContext,
    events: {} as CartEvent,
  },
  actions: {
    assignPendingItem: assign({
      pendingItem: ({ event }) =>
        event.type === "ADD_ITEM" ? { ...event.item, quantity: 1 } : undefined,
    }),
    assignError: assign({
      error: ({ event }) =>
        event.type === "ERROR" ? event.message : undefined,
    }),
    clearError: assign({
      error: undefined,
    }),
    clearPendingItem: assign({
      pendingItem: undefined,
    }),
    addItemToCart: assign({
      items: ({ context }) => {
        if (!context.pendingItem) return context.items;

        const existingItem = context.items.find(
          (item) => item.id === context.pendingItem?.id
        );

        if (existingItem) {
          return context.items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...context.items, context.pendingItem];
      },
      pendingItem: undefined,
    }),
    updateQuantity: assign({
      items: ({ context, event }) => {
        if (event.type !== "UPDATE_QUANTITY") return context.items;
        return context.items.map((item) =>
          item.id === event.id ? { ...item, quantity: event.quantity } : item
        );
      },
    }),
    removeItem: assign({
      items: ({ context, event }) => {
        if (event.type !== "REMOVE_ITEM") return context.items;
        return context.items.filter((item) => item.id !== event.id);
      },
    }),
  },
}).createMachine({
  id: "cart",
  initial: "idle",
  context: {
    items: [],
    pendingItem: undefined,
    error: undefined,
  },
  states: {
    idle: {
      on: {
        ADD_ITEM: {
          target: "addingItem",
          actions: "assignPendingItem",
        },
        CHECKOUT: "checkingOut",
        UPDATE_QUANTITY: {
          actions: "updateQuantity",
        },
        REMOVE_ITEM: {
          actions: "removeItem",
        },
        ERROR: {
          target: "error",
          actions: "assignError",
        },
      },
    },
    addingItem: {
      on: {
        SUCCESS: {
          target: "idle",
          actions: "addItemToCart",
        },
        ERROR: {
          target: "error",
          actions: ["assignError", "clearPendingItem"],
        },
      },
    },
    error: {
      on: {
        RETRY: {
          target: "idle",
          actions: "clearError",
        },
        ADD_ITEM: {
          target: "addingItem",
          actions: "assignPendingItem",
        },
        CHECKOUT: "checkingOut",
      },
    },
    checkingOut: {
      on: {
        SUCCESS: "checkoutSuccess",
        ERROR: {
          target: "checkoutError",
          actions: "assignError",
        },
      },
    },
    checkoutSuccess: {
      on: {
        ADD_ITEM: {
          target: "addingItem",
          actions: "assignPendingItem",
        },
      },
    },
    checkoutError: {
      on: {
        RETRY: {
          target: "checkingOut",
          actions: "clearError",
        },
        ADD_ITEM: {
          target: "addingItem",
          actions: "assignPendingItem",
        },
      },
    },
  },
});
