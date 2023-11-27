<template>
  <ul>
    <li v-for="item in todoList" :key="item.id">
      <a :href="`/todos/${item.id}`">
        {{ item.text }}
      </a>
    </li>
  </ul>
</template>

<script setup>
import { onServerPrefetch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTodos } from '../../stores/useTodos'

const todosStore = useTodos()
const { todoList } = storeToRefs(todosStore)

const loadTodos = async () => {
  await todosStore.fetchTodoList()
}

// Actually not guaranteed to work, see https://github.com/vikejs/vike/discussions/1319
onServerPrefetch(loadTodos)

onMounted(loadTodos)
</script>
