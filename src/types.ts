// types/index.ts
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
  | 'idle'
  | 'addingItem'
  | 'error'
  | 'checkingOut'
  | 'checkoutSuccess'
  | 'checkoutError';

export type CartEvent =
  | { type: 'ADD_ITEM'; item: Product }
  | { type: 'REMOVE_ITEM'; id: number }
  | { type: 'UPDATE_QUANTITY'; id: number; quantity: number }
  | { type: 'CHECKOUT' }
  | { type: 'RETRY' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; message: string };
