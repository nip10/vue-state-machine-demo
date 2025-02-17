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
