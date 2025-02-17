export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type CartState =
  | "idle"
  | "addingItem"
  | "error"
  | "checkingOut"
  | "checkoutSuccess"
  | "checkoutError";

export type CartEvent =
  | { type: "ADD_ITEM"; item: Product }
  | { type: "REMOVE_ITEM"; id: number }
  | {
      type: "UPDATE_QUANTITY";
      id: number;
      quantity: number;
    }
  | { type: "CHECKOUT" }
  | { type: "RETRY" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; message: string };

export type CartContext = {
  items: CartItem[];
  pendingItem: CartItem | undefined;
  error: string | undefined;
};

export type Transitions = {
  [State in CartState]: {
    on: {
      [EventType in CartEvent["type"]]?: {
        target: CartState;
        action?: (
          context: CartContext,
          event: Extract<CartEvent, { type: EventType }>
        ) => void;
      };
    };
  };
};
