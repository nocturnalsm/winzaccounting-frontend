<template>
  <div>
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
            <div class="text-subtitle-1 text-medium-emphasis">Account</div>

            <v-text-field
                density="compact"
                placeholder="Email address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
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
                @click:append-inner="password_visible = !password_visible"
            ></v-text-field>     

            <v-btn
                block
                class="mb-8"
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
  
    const password_visible = ref(false)
    const loading = ref(false)
    const errors = ref(null)
    const { $sanctumAuth  } = useNuxtApp()
    const credentials = ref({
        email: '',
        password: ''
    })

    async function login() {                
        loading.value = true
        errors.value = {}
        try {
            await $sanctumAuth.login(
                {
                    email: credentials.value.email,
                    password: credentials.value.password
                }
            )
        } 
        catch (e) {
            // your error handling
            console.log(e)
            errors.value = e.errors                    
        }
        finally {
            loading.value = false
        }
    }

</script>
