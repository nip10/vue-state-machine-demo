import type { CartState, CartEvent, CartItem } from '../types';

type Transitions = {
  [State in CartState]: {
    on: {
      [EventType in CartEvent['type']]?: {
        target: CartState;
        action?: () => void;
      };
    };
  };
};

export class CartMachine {
  state: CartState = 'idle';
  context = {
    items: [] as CartItem[],
    error: undefined as string | undefined,
    total: 0,
  };

  private calculateTotal() {
    this.context.total = this.context.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  private transitions: Transitions = {
    idle: {
      on: {
        ADD_ITEM: {
          target: 'addingItem',
        },
        CHECKOUT: {
          target: 'checkingOut',
        },
        UPDATE_QUANTITY: {
          target: 'idle',
          action: () => this.calculateTotal(),
        },
        REMOVE_ITEM: {
          target: 'idle',
          action: () => this.calculateTotal(),
        },
      },
    },
    addingItem: {
      on: {
        SUCCESS: {
          target: 'idle',
          action: () => this.calculateTotal(),
        },
        ERROR: {
          target: 'error',
        },
      },
    },
    error: {
      on: {
        RETRY: { target: 'idle' },
        ADD_ITEM: { target: 'addingItem' },
        CHECKOUT: { target: 'checkingOut' },
      },
    },
    checkingOut: {
      on: {
        SUCCESS: { target: 'checkoutSuccess' },
        ERROR: { target: 'checkoutError' },
      },
    },
    checkoutSuccess: {
      on: {
        ADD_ITEM: { target: 'addingItem' },
      },
    },
    checkoutError: {
      on: {
        RETRY: { target: 'checkingOut' },
        ADD_ITEM: { target: 'addingItem' },
      },
    },
  };

  dispatch(event: CartEvent): void {
    console.log(`Current state: ${this.state}, Event: ${event.type}`);
    const transition = this.transitions[this.state].on[event.type];

    if (transition) {
      // Handle specific events
      switch (event.type) {
        case 'ADD_ITEM':
          this.context.items.push({ ...event.item, quantity: 1 });
          break;
        case 'REMOVE_ITEM':
          this.context.items = this.context.items.filter(
            (item) => item.id !== event.id
          );
          break;
        case 'UPDATE_QUANTITY':
          const item = this.context.items.find((i) => i.id === event.id);
          if (item) {
            item.quantity = event.quantity;
          }
          break;
        case 'ERROR':
          this.context.error = event.message;
          break;
      }

      // Perform state transition
      this.state = transition.target;
      transition.action?.();

      // Clear error when transitioning to non-error states
      if (this.state !== 'error' && this.state !== 'checkoutError') {
        this.context.error = undefined;
      }
    } else {
      console.warn(
        `No transition found for event ${event.type} in state ${this.state}`
      );
    }
  }
}
