<template>
    <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">        
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Register User
                </h1>
                <form v-if="registerStatus === ''" method="post" @submit.prevent="handleSubmit" class="space-y-4" action="#">                    
                    <div>
                        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                        <input @input="error = null" :disabled="loading" v-model="data.name" required type="text" id="name" placeholder="" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <p class="text-danger text-sm" v-if="error && error.name">{{ error.name.join('\n') }}</p>
                    </div>
                    <div>
                        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input @input="error = null" :disabled="loading" v-model="data.email" required type="text" id="email" placeholder="" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <p class="text-danger text-sm" v-if="error && error.email">{{ error.email.join('\n') }}</p>
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your new password</label>
                        <Password class="w-full" inputClass="w-full" ::toggleMask="true" @input="error = null" :disabled="loading" v-model="data.password" required type="password" id="password" placeholder="" />
                    </div>                    
                    <div>
                        <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm your new password</label>
                        <Password class="w-full" inputClass="w-full" :toggleMask="true" @input="error = null" :disabled="loading" v-model="data.password_confirmation" />
                        <p class="text-danger text-sm" v-if="error && error.password">{{ error.password.join('\n') }}</p>
                    </div>                                        
                    <Button :disabled="loading" label="Register Now" type="submit" class="w-full text-sm" />                    
                </form>
                <p class="bg-green-400 px-4 py-2 text-sm" v-show="registerStatus !== ''">{{ registerStatus }}</p>
                <p class="text-center text-sm font-light mt-4">
                    Already have an account ? <NuxtLink :disabled="loading" to="login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</NuxtLink>
                </p>
            </div>
        </div>
    </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {                
                data: {
                    email: '',
                    name: '', 
                    password: '',
                    password_confirmation: '',
                },
                loading: false,
                error: null,
                registerStatus: ''
            }
        },    
        methods: {
            async handleSubmit() {
                this.$nuxt.$loading.start();
                this.loading = true
                try {
                    this.$axios.$get('/sanctum/csrf-cookie')
                    const response = await this.$axios.$post('/api/register', this.data)                    
                    this.registerStatus = 'Register success !'
                } 
                catch (err) {
                    console.log(err)
                    this.error = err.response.data.errors
                }
                finally {
                    this.$nuxt.$loading.finish();
                    this.loading = false
                }
            }            
        }
    }
</script>