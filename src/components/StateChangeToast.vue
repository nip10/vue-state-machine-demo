// components/StateChangeToast.vue
<script setup lang="ts">
import { ArrowRight, X } from "lucide-vue-next";

defineProps<{
  previousState: string;
  currentState: string;
  event: string;
  context?: {
    itemCount: number;
    total: string;
    items?: Array<{
      id: number;
      name: string;
      quantity: number;
      price: number;
    }>;
  };
  error?: string;
}>();

const emit = defineEmits<{
  (e: "closeToast"): void;
}>();
</script>

<template>
  <div class="space-y-2 w-[350px] p-2 relative">
    <!-- Close Button -->
    <button
      @click="emit('closeToast')"
      class="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-100 transition-colors"
    >
      <X class="w-4 h-4 text-gray-500" />
    </button>

    <!-- State Transition -->
    <div class="flex items-center gap-2 pr-6">
      <div class="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
        {{ previousState.toUpperCase() }}
      </div>
      <ArrowRight class="w-4 h-4 text-gray-400 flex-shrink-0" />
      <div
        class="px-2 py-1 rounded text-sm font-mono"
        :class="error ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'"
      >
        {{ currentState.toUpperCase() }}
      </div>
    </div>

    <!-- Event -->
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-gray-500">Event:</span>
      <span
        class="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-mono break-all"
      >
        {{ event }}
      </span>
    </div>

    <!-- Error (if any) -->
    <div v-if="error" class="text-sm text-red-500 bg-red-50 p-2 rounded">
      {{ error }}
    </div>

    <!-- Cart Context (if available) -->
    <div v-if="context" class="text-xs text-gray-500 border-t pt-2 mt-2">
      Items: {{ context.itemCount }} | Total: ${{ context.total }}
    </div>
  </div>
</template>
