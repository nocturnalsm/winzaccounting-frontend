<template>
  <v-app id="inspire">
    <Toast />
    <v-system-bar>
      <CompanySelect />
    </v-system-bar>

    <v-app-bar>
        <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-app-bar-title>{{ appTitle }}</v-app-bar-title>
        <v-spacer></v-spacer>
        <top-menu class="d-none d-md-inline" />
        <v-spacer></v-spacer>

        <v-btn variant="text" icon="mdi-message-reply-text"></v-btn>

        <v-btn variant="text" icon="mdi-bell"></v-btn>

        <ProfileMenu />
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      class="d-md-none"
      temporary
    >
      <SidebarMenu />
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-2">
        <v-container fluid>
            <slot></slot>
        </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
    import { computed } from 'vue'    
    import { activeCompany } from '~/store/activeCompany';

    const appTitle = computed(() => {
        const config = useRuntimeConfig()
        return config.public.appTitle
    })

    const drawer = ref(null)
    const { user } = useAuth()

    useHead({
        title: appTitle,
    })

    const company = window.localStorage.getItem('company')    
    if (company){
        let parsed = JSON.parse(company)
        let index = user.companies.findIndex(item => item.id == parsed.id)   
        if (index >= 0){
          activeCompany.set(parsed)
        }
        else {
          let first = user.companies[0]
          activeCompany.set(first)
          window.localStorage.setItem('company', JSON.stringify(first))  
        }
    }
    else {        
        let first = user.companies[0]
        activeCompany.set(first)
        window.localStorage.setItem('company', JSON.stringify(first))
    }

</script>