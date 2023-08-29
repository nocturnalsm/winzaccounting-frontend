<template>
    <v-snackbar
      v-model="toast.visible"
      multi-line
      :color="computedColor"
      location="top right"
    >
      {{ toast.message }}

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="toast.hide"
        >
          <v-icon icon="mdi-close"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script setup>
    import { computed } from 'vue'
    import { toast } from '~/store/toast'

    const computedColor = computed(() => {
        return toast.state
    })
</script>