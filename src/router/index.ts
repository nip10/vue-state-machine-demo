import { createRouter, createWebHistory } from "vue-router";
import ProductsPage from "../pages/Products.vue";
import CartPage from "../pages/Cart.vue";
import CheckoutPage from "../pages/Checkout.vue";
import SuccessPage from "../pages/Success.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: ProductsPage,
    },
    {
      path: "/cart",
      component: CartPage,
    },
    {
      path: "/checkout",
      component: CheckoutPage,
    },
    {
      path: "/success",
      component: SuccessPage,
    },
  ],
});
