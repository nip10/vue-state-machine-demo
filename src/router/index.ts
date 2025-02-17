import { createRouter, createWebHistory } from "vue-router";
import ProductsPage from "@/pages/Products.vue";
import CartPage from "@/pages/Cart.vue";
import CheckoutPage from "@/pages/Checkout.vue";
import SuccessPage from "@/pages/Success.vue";
import { useCart } from "@/composables/useCart";

const { items, state } = useCart();

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
      beforeEnter: () => {
        if (items.value.length === 0) {
          return "/"; // Redirect to products page if cart is empty
        }
      },
    },
    {
      path: "/success",
      component: SuccessPage,
      beforeEnter: () => {
        if (state.value !== "checkoutSuccess") {
          return "/"; // Redirect to products page if we are not coming from the checkout page after success
        }
      },
    },
  ],
});
