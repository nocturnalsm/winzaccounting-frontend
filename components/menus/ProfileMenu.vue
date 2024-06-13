<template>
    <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <Avatar v-bind="computedProps" :size="40" />
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto">              
              <h3>{{ user.name }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="mt-4"></v-divider>
              <v-list>                
                <v-list-item>                        
                    <v-list-item-title>Settings</v-list-item-title>                            
                </v-list-item>                
                <v-list-item @click="handleLogout">                        
                    <v-list-item-title>Logout</v-list-item-title>                            
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
</template>

<script setup>
    
    const { user } = useAuth()
    const { $sanctumAuth } = useNuxtApp()

    const handleLogout = () => {
        $sanctumAuth.logout()
    }

    const computedProps = computed(() => {
        if (user.avatar){
          if (user.avatar?.startsWith('http')){
              return {
                  image: user.avatar
              }
          }
          if (user.avatar?.startsWith('mdi-')){
              return {
                  icon: user.avatar
              }
          }
          return { label: user.avatar }
        }
        return null
    })
</script>