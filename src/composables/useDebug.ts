import { ref } from "vue";

const enabled = ref(false);

const debugEventBus = {
  subscribers: new Set<(state: string, event: any) => void>(),
  subscribe(callback: (state: string, event: any) => void) {
    debugEventBus.subscribers.add(callback);
    return () => debugEventBus.subscribers.delete(callback);
  },
  notify(state: string, event: any) {
    if (enabled.value) {
      debugEventBus.subscribers.forEach((callback) => callback(state, event));
    }
  },
};

export const useDebug = () => {
  return {
    enabled,
    ...debugEventBus,
  };
};
