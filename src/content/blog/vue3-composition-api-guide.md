---
title: "Vue 3 Composition API: A Complete Guide"
date: "2024-11-10"
description: "Explore the power of Composition API in Vue 3 and how it improves code organization and reusability."
tags: ["JavaScript", "Vue.js", "Frontend"]
author: "Your Name"
---

# Vue 3 Composition API: A Complete Guide

The Composition API is one of the most significant additions to Vue 3. It provides a new way to organize and reuse component logic, making your code more maintainable and scalable.

## What is the Composition API?

The Composition API is a set of additive, function-based APIs that allow flexible composition of component logic. It's an alternative to the Options API that we've been using in Vue 2.

## Why Use Composition API?

### Better Logic Reuse

With the Options API, reusing logic across components often required mixins or higher-order components. The Composition API makes this much cleaner:

```javascript
// useCounter.js
import { ref, computed } from "vue";

export function useCounter() {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
}
```

### Better Type Inference

TypeScript support is significantly better with the Composition API:

```typescript
import { ref, Ref } from "vue";

interface User {
  name: string;
  age: number;
}

const user: Ref<User> = ref({
  name: "John",
  age: 30,
});
```

## Core Concepts

### Reactive References

The `ref` function creates a reactive reference:

```javascript
import { ref } from "vue";

const count = ref(0);
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```

### Reactive Objects

For objects, use `reactive`:

```javascript
import { reactive } from "vue";

const state = reactive({
  count: 0,
  message: "Hello",
});

state.count++;
```

### Computed Properties

```javascript
import { ref, computed } from "vue";

const count = ref(0);
const doubleCount = computed(() => count.value * 2);
```

### Watchers

```javascript
import { ref, watch } from "vue";

const count = ref(0);

watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});
```

## Lifecycle Hooks

```javascript
import { onMounted, onUpdated, onUnmounted } from "vue";

export default {
  setup() {
    onMounted(() => {
      console.log("Component mounted");
    });

    onUpdated(() => {
      console.log("Component updated");
    });

    onUnmounted(() => {
      console.log("Component unmounted");
    });
  },
};
```

## Complete Example

Here's a complete component using the Composition API:

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const title = ref("My Component");
const count = ref(0);
const items = ref([]);

const doubleCount = computed(() => count.value * 2);

const filteredItems = computed(() => {
  return items.value.filter((item) => item.active);
});

function increment() {
  count.value++;
}

onMounted(async () => {
  const response = await fetch("/api/items");
  items.value = await response.json();
});
</script>
```

## Best Practices

1. **Use `<script setup>`** - It's more concise and has better performance
2. **Extract reusable logic** - Create composables for shared functionality
3. **Keep setup function organized** - Group related logic together
4. **Use TypeScript** - Get better type safety and autocomplete

## Conclusion

The Composition API is a powerful addition to Vue 3 that makes your code more organized, reusable, and maintainable. While the Options API is still fully supported, the Composition API is recommended for new projects.
