<template>
  <h1>Pinia Example</h1>
  <span>Counter that keeps its state on navigation</span>:
  <button type="button" @click="counterStore.increment">Counter {{ count }}</button>
  <h2>To-do List</h2>
  <Suspense>
    <TodoList />
    <template #fallback>
      <p>Loading...</p>
    </template>
  </Suspense>
</template>

<script setup>
import TodoList from './TodoList.vue'

import { storeToRefs } from 'pinia'
import { useCounter } from '../../stores/useCounter'

const counterStore = useCounter()
const { count } = storeToRefs(counterStore)
</script>
