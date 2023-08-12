<template>
    <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">        
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Reset Password
                </h1>
                <form v-if="resetStatus === ''" method="post" @submit.prevent="handleSubmit" class="space-y-4" action="#">                    
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your new password</label>
                        <Password class="w-full" inputClass="w-full" :toggleMask="true" :disabled="loading" v-model="password" required type="password" name="password" id="password" placeholder="" />
                    </div>
                    <div>
                        <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm your new password</label>
                        <Password class="w-full" inputClass="w-full" :toggleMask="true" :disabled="loading" v-model="password_confirmation" required type="password" name="password" id="password" placeholder="" />
                    </div>
                    <p class="text-danger text-sm" v-show="error !== ''">{{ error }}</p>                    
                    <Button :disabled="loading" label="Reset Password" type="submit" class="w-full text-sm" />                    
                </form>
                <p class="bg-green-400 px-4 py-2 text-sm" v-show="resetStatus !== ''">{{ resetStatus }}</p>
                <p class="text-center text-sm font-light mt-4">
                    Don't have an account yet ? <NuxtLink :disabled="loading" to="register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Register</NuxtLink>
                </p>
            </div>
        </div>
    </div>
    </section>
</template>

<script>
    export default {
        auth: 'guest',
        data() {
            return {                
                password: '',
                password_confirmation: '',
                loading: false,
                error: '',
                resetStatus: ''
            }
        },    
        methods: {
            async handleSubmit() {
                this.$nuxt.$loading.start();
                this.loading = true
                try {
                    this.$axios.$get('/sanctum/csrf-cookie')
                    const response = await this.$axios.$post('/api/reset-password', { 
                            token: this.$route.query.token,
                            email: this.$route.query.email,                            
                            password: this.password,
                            password_confirmation: this.password_confirmation
                    })                    
                    this.resetStatus = response.message
                } 
                catch (err) {
                    console.log(err)
                    this.error = err.response.data ? err.response.data.message : "Unknown error. Please try again in a few minutes"
                }
                finally {
                    this.$nuxt.$loading.finish();
                    this.loading = false
                }
            }            
        }
    }
</script>