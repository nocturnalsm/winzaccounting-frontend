<template>
  <Dashboard>    
    <Toast position="top-right" />
    <div class="form rounded-lg bg-white">
        <div class="bg-gray-300 py-4 px-8 rounded-t-lg">
            <h5 ref="topheader" class="text-xl">Edit Profile</h5>
        </div>
        <div class="p-8 space-y-2">
            <form :disabled="loading" method="post" @submit.prevent="updateProfile">
                <div class="mb-4">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your name</label>
                    <input @input="errorProfile = null" :disabled="loading" v-model="profile.name" required type="text" id="name" placeholder="" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <p class="text-danger text-sm" v-if="errorProfile && errorProfile.name">{{ errorProfile.name.join('\n') }}</p>
                </div>
                <div class="mb-4">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input @input="errorProfile = null" :disabled="loading" v-model="profile.email" required type="text" id="email" placeholder="" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <p class="text-danger text-sm" v-if="errorProfile && errorProfile.email">{{ errorProfile.email.join('\n') }}</p>
                </div>
                <Button :disabled="loading" label="Update Profile" type="submit" class="text-sm" />
            </form>
            <form :disabled="loading" method="post" @submit.prevent="changePassword">
                <h5 class="text-xl mt-8">Change Password</h5>
                <div class="my-4">
                    <label for="current_password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your current password</label>
                    <Password class="w-full" inputClass="w-full" :toggleMask="true" @input="errorPassword = null" :disabled="loading" v-model="password.current_password" required placeholder="" />
                    <p class="text-danger text-sm" v-if="errorPassword && errorPassword.current_password">{{ errorPassword.current_password.join('\n') }}</p>
                </div>   
                <div class="my-4">
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your new password</label>
                    <Password class="w-full" inputClass="w-full" :toggleMask="true" @input="errorPassword = null" :disabled="loading" v-model="password.password" required placeholder="" />
                </div>                    
                <div class="mb-4">
                    <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm your new password</label>
                    <Password class="w-full" inputClass="w-full" :toggleMask="true" @input="errorPassword = null" :disabled="loading" v-model="password.password_confirmation" required placeholder="" />
                    <p class="text-danger text-sm" v-if="errorPassword && errorPassword.password">{{ errorPassword.password.join('\n') }}</p>
                </div>                                        
                <Button :disabled="loading" label="Change Password" type="submit" class="text-sm" />
            </form>
        </div>
    </div>
  </Dashboard>
</template>

<script>
    export default {
        middleware: 'auth',
        data() {
            return {
                profile: {
                    name: '',
                    email: '',
                    facebook_id: '',
                },
                password: {
                    password: '',
                    password_confirmation: '',
                    current_password: ''
                },
                loading: false,
                errorProfile: null,
                errorPassword: null
            }
        },
        methods: {            
            async updateProfile() {
                try {
                    this.loading = true                    
                    const response = await this.$axios.$post('/api/auth/user', this.profile)                    
                    let data = this.$auth.user.data
                    this.$auth.user.data = {...data, ...this.profile}
                    this.$toast.add({severity:'success', summary: 'Successfully updated user', life: 3000})
                }
                catch (err){
                    this.errorProfile = err.response.data.errors ?? []
                    let error = err.response.data.message ?? 'Unknown error. Please try again'
                    this.$toast.add({severity:'error', summary: error, life: 3000})
                }
                finally {
                    this.loading = false
                }
            },
            async changePassword() {
                try {
                    this.loading = true                    
                    const response = await this.$axios.$post('/api/auth/change-password', this.password)                    
                    this.$toast.add({severity:'success', summary: 'Successfully change password', life: 3000})
                }
                catch (err){
                    this.errorPassword = err.response.data.errors ?? []
                    let error = err.response.data.message ?? 'Unknown error. Please try again'
                    this.$toast.add({severity:'error', summary: error, life: 3000})
                }
                finally {
                    this.loading = false
                }
            }
        },        
        async mounted() {
            let user = this.$auth.user.data
            console.log(user)
            this.profile = {
                name: user.name,
                email: user.email,                
                facebook_id: user.facebook_id
            }
        },
    }
</script>