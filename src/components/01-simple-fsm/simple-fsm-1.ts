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
