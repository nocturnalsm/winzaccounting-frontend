<template>
  <div>
    <Toast />
    <v-img
      class="mx-auto my-6"
      max-width="228"
      src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>

    <v-card
        :loading="loading"
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
    >
        <form @submit.prevent="login">
            <div class="text-subtitle-1 text-medium-emphasis">Username</div>

            <v-text-field
                density="compact"
                v-model="credentials.username"
                placeholder="Username"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                :error-messages="handleError('username')"
            ></v-text-field>            

            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                Password        
            </div>

            <v-text-field
                :append-inner-icon="password_visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="password_visible ? 'text' : 'password'"
                density="compact"
                placeholder="Enter your password"
                prepend-inner-icon="mdi-lock-outline"
                variant="outlined"
                v-model="credentials.password"
                @click:append-inner="password_visible = !password_visible"
                :error-messages="handleError('password')"
            ></v-text-field>     

            <v-btn
                :loading="loading"
                block
                class="mt-4 mb-8"
                color="primary"
                size="large"
                variant="tonal"
                type="submit"
            >
                Log In
            </v-btn>

            <div class="d-flex justify-between">
                <v-card-text class="text-center">
                    <a
                        class="text-blue text-decoration-none"
                        href="#"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
                    </a>
                </v-card-text>
                <v-card-text class="text-center">
                    <a
                        class="text-decoration-none text-blue"
                        href="#"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Forgot Password?
                    </a>
                </v-card-text>
            </div>
        </form>
    </v-card>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    definePageMeta({
        middleware: 'guest'
    })
    const password_visible = ref(false)
    const loading = ref(false)
    const errors = ref(null)
    const { $sanctumAuth  } = useNuxtApp()
    const credentials = ref({
        username: '',
        password: ''
    })

    async function login() {                
        loading.value = true
        errors.value = {}
        try {
            await $sanctumAuth.login(
                {
                    username: credentials.value.username,
                    password: credentials.value.password
                }
            )
        } 
        catch (e) {
            // your error handling            
            if (e.errors){
                errors.value = e.errors
            }
            else {                
                $toast({
                    state: 'error',
                    message: e.message
                })
            }
        }
        finally {
            loading.value = false
        }
    }

    const handleError = input => {
        let err = errors.value
        if (err){
            if (err[input]){
                return err[input]
            }            
        }        
    }
</script>
