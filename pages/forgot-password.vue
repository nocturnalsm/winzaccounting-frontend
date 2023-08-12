<template>
    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">        
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Forgot your password ?
                    </h1>                                
                    <form method="post" @submit.prevent="handleSubmit" class="space-y-4 md:space-y-6">
                        <div v-if="resetStatus == ''">
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Please enter your email
                            </label>
                            <input :disabled="loading"
                                autoFocus 
                                v-model="email" 
                                required 
                                type="email" 
                                @input="error = ''"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder=""
                            />               
                            <p class="text-danger text-sm mt-2" v-if="error != ''">{{ error }}</p>                                         
                        </div>
                        <p class="bg-green-400 px-4 py-2 text-sm mt-2" v-if="resetStatus != ''">{{ resetStatus }}</p>
                        <Button v-if="resetStatus == ''" :disabled="loading" label="Reset password" type="submit" class="w-full text-sm" />
                        <p class="text-center text-sm font-light">
                            Don't have an account yet ? <NuxtLink :disabled="loading" to="register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</NuxtLink> or 
                            <NuxtLink to="/login">Sign In</NuxtLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                loading: false,
                resetStatus: '',
                error: ''
            }
        },
        methods: {
            async handleSubmit() {
                this.loading = true
                try {
                    this.$axios.$get('/sanctum/csrf-cookie')
                    const response = await this.$axios.$post('/api/forgot-password', {email: this.email})
                    console.log(response)
                    this.resetStatus = response.message
                }
                catch (err){                    
                    this.error = err.response.data ? err.response.data.message : 'Error occured'
                }
                finally {
                    this.loading = false
                }
            }
        }
    }
</script>