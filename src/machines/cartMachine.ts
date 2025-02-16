import type { CartState, CartEvent, CartItem } from "../types";
import { useDebug } from "@/composables/useDebug";

const debug = useDebug();

type Transitions = {
  [State in CartState]: {
    on: {
      [EventType in CartEvent["type"]]?: {
        target: CartState;
        action?: (
          context: {
            items: CartItem[];
            error?: string;
            pendingItem?: CartItem;
          },
          event: Extract<CartEvent, { type: EventType }>
        ) => void;
      };
    };
  };
};

export class CartMachine {
  state: CartState = "idle";

  context = {
    items: [] as CartItem[],
    pendingItem: undefined as CartItem | undefined,
    error: undefined as string | undefined,
  };

  private transitions: Transitions = {
    idle: {
      on: {
        ADD_ITEM: {
          target: "addingItem",
          action: (context, event) => {
            // Store the pending item in context, but don't add to cart yet
            context.pendingItem = {
              ...event.item,
              quantity: 1,
            };
          },
        },
        CHECKOUT: {
          target: "checkingOut",
        },
        UPDATE_QUANTITY: {
          target: "idle", // Stay in idle state
          action: (context, event) => {
            const item = context.items.find((i) => i.id === event.id);
            if (item) {
              item.quantity = event.quantity;
            }
          },
        },
        REMOVE_ITEM: {
          target: "idle",
          action: (context, event) => {
            context.items = context.items.filter(
              (item) => item.id !== event.id
            );
          },
        },
        ERROR: {
          target: "error",
          action: (context, event) => {
            context.error = event.message;
          },
        },
      },
    },
    addingItem: {
      on: {
        SUCCESS: {
          target: "idle",
          action: (context) => {
            // Only add the item to cart on SUCCESS
            if (context.pendingItem) {
              const existingItem = context.items.find(
                (item) => item.id === context.pendingItem?.id
              );
              if (existingItem) {
                existingItem.quantity += 1;
              } else {
                context.items.push({ ...context.pendingItem, quantity: 1 });
              }
              // Clear the pending item
              context.pendingItem = undefined;
            }
          },
        },
        ERROR: {
          target: "error",
          action: (context) => {
            // Clear the pending item on error
            context.pendingItem = undefined;
          },
        },
      },
    },
    error: {
      on: {
        RETRY: {
          target: "idle",
          action: (context) => {
            // Clear any existing error
            context.error = undefined;
          },
        },
        ADD_ITEM: {
          target: "addingItem",
          action: (context, event) => {
            // Store the pending item in context, but don't add to cart yet
            context.pendingItem = {
              ...event.item,
              quantity: 1,
            };
          },
        },
        CHECKOUT: { target: "checkingOut" },
      },
    },
    checkingOut: {
      on: {
        SUCCESS: { target: "checkoutSuccess" },
        ERROR: {
          target: "checkoutError",
          action: (context, event) => {
            context.error = event.message;
          },
        },
      },
    },
    checkoutSuccess: {
      on: {
        ADD_ITEM: {
          target: "addingItem",
          action: (context, event) => {
            // Store the pending item in context, but don't add to cart yet
            context.pendingItem = {
              ...event.item,
              quantity: 1,
            };
          },
        },
      },
    },
    checkoutError: {
      on: {
        RETRY: {
          target: "checkingOut",
          action: (context) => {
            // Clear any existing error
            context.error = undefined;
          },
        },
        ADD_ITEM: {
          target: "addingItem",
          action: (context, event) => {
            // Store the pending item in context, but don't add to cart yet
            context.pendingItem = {
              ...event.item,
              quantity: 1,
            };
          },
        },
      },
    },
  };

  dispatch(event: CartEvent): void {
    console.log(
      `Current state: ${this.state}, Event: ${JSON.stringify(event, null, 2)}`
    );
    console.log(
      `Available transitions for current state:`,
      Object.keys(this.transitions[this.state].on)
    );

    const previousState = this.state;

    const transition = this.transitions[this.state].on[event.type];
    console.log(`Transition found:`, transition ? "Yes" : "No");

    if (transition) {
      // Perform state transition
      this.state = transition.target;
      console.log(`Transitioning to state: ${this.state}`);

      // Perform any side effects
      transition.action?.call(this, this.context, event as any);

      // Notify debug system of state change
      debug.notify(this.state, {
        event,
        previousState,
        context: {
          itemCount: this.context.items.length,
          items: this.context.items.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        // Add transition info
        transition: {
          from: previousState,
          to: this.state,
          event: event.type,
        },
      });

      // Clear error when transitioning to non-error states
      if (this.state !== "error" && this.state !== "checkoutError") {
        this.context.error = undefined;
      }

      console.log("this.context", this.context);
    } else {
      console.warn(
        `No transition found for event ${event.type} in state ${this.state}`,
        `\nCurrent state transitions:`,
        this.transitions[this.state].on
      );
    }
  }
}
