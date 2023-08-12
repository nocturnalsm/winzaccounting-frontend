<template>
  <v-app id="inspire">
    <v-system-bar>
      <v-spacer></v-spacer>

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon>
    </v-system-bar>

    <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-app-bar-title>{{ appTitle }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <menu-bar class="d-none d-lg-inline" />
        <v-spacer></v-spacer>

        <v-btn variant="text" icon="mdi-message-reply-text"></v-btn>

        <v-btn variant="text" icon="mdi-bell"></v-btn>

        <v-btn variant="text" icon="mdi-account"></v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
    >
      <!--  -->
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
      
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  const drawer = ref(null)
</script>

<script>
    import { computed } from 'vue'

    const appTitle = computed(() => {
        const config = useRuntimeConfig()
        return config.public.appTitle
    })

    export default {
        data: () => ({ drawer: null }),
    }
    useHead({
        title: appTitle,
    })
</script>