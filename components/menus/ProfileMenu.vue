<template>
    <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar
              color="brown"              
            >
              <span class="text-h6">{{ user.initials }}</span>
            </v-avatar>
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
</script>