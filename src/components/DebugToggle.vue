<script setup lang="ts">
import { defineComponent, h, markRaw, onUnmounted } from "vue";
import { Switch } from "@/components/ui/switch";
import { Bug } from "lucide-vue-next";
import { useDebug } from "../composables/useDebug";
import StateChangeToast from "./StateChangeToast.vue";
import { toast } from "vue-sonner";
import type { CartEvent } from "@/types";

const { enabled, subscribe } = useDebug();

const formatEventData = (event: CartEvent) => {
  switch (event.type) {
    case "ADD_ITEM":
      return `${event.type} (${event.item.name} - $${event.item.price})`;

    case "REMOVE_ITEM":
      return `${event.type} (ID: ${event.id})`;

    case "UPDATE_QUANTITY":
      return `${event.type} (ID: ${event.id}, New Qty: ${event.quantity})`;

    case "CHECKOUT":
      return "CHECKOUT";

    case "RETRY":
      return "RETRY";

    case "SUCCESS":
      return "SUCCESS";

    case "ERROR":
      return `ERROR (${event.message})`;

    default:
      // @ts-expect-error - This should never happen
      return `Unknown Event: ${event.type}`;
  }
};

// Setup toast notification when debug is enabled
const unsubscribe = subscribe((currentState, data) => {
  const { event, previousState } = data;

  const ToastComponent = defineComponent({
    setup() {
      return () =>
        h(StateChangeToast, {
          previousState,
          currentState,
          event: formatEventData(event),
        });
    },
  });

  toast("🔄 State Change", {
    component: markRaw(ToastComponent),
  });
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<template>
  <div
    class="fixed bottom-2 left-4 flex items-center gap-2 bg-white p-2 rounded-lg shadow-lg z-50"
  >
    <Bug class="w-4 h-4" :class="{ 'text-blue-500': enabled }" />
    <span class="text-sm">Debug</span>
    <Switch @update:checked="(checked) => (enabled = checked)" />
  </div>
</template>
