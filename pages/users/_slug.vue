<template>
    <Dashboard>
        <Toast position="top-right" />
        <div class="form rounded-lg bg-white">
            <div class="bg-gray-300 py-4 px-8 rounded-t-lg">
                <h5 ref="topheader" class="text-xl">Edit User</h5>
            </div>
            <div class="p-8">
                <form :disabled="loading" method="post" @submit.prevent="submitForm">
                    <div class="grid gap-6 mb-4 md:grid-cols-2">
                        <div class="grow-2">
                            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Name</label>
                            <input :disabled="loading" v-model="data.name" type="text" id="name" class="h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter user's name" required>
                            <div v-text="errors.name.join('<br />')" class="text-danger text-sm my-2" v-if="errors && errors.name" />
                        </div>
                        <div class="grow-2">
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">E-mail</label>
                            <input :disabled="loading" v-model="data.email" type="email" id="name" class="h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter user's email" required>
                            <div v-text="errors.email.join('<br />')" class="text-danger text-sm my-2" v-if="errors && errors.email" />
                        </div>
                    </div>
                    <div class="mb-4">
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Select Roles</label>
                            <v-select 
                                :disabled="loading" 
                                placeholder="Select Role"                                
                                label="name"                          
                                multiple
                                id="select_role"
                                :options="roles"                                                                 
                                v-model="data.roles"
                            >
                                <template slot="no-options">
                                    type to search roles
                                </template>
                            </v-select>
                            <div v-text="errors.roles.join('<br />')" class="text-danger text-sm my-2" v-if="errors && errors.roles" />                                                                                   
                        </div>   
                    </div>                     
                    <div class="grid gap-6 mb-4 md:grid-cols-2">
                        <div class="grow-2">
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                Password (Empty this if you don't want to change your password)
                            </label>
                            <input :disabled="loading" v-model="data.password" type="password" id="password" class="h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter password">
                            <div v-text="errors.password.join('<br />')" class="text-danger text-sm my-2" v-if="errors && errors.password" />
                        </div>
                    </div>
                    <Button :disabled="loading" type="submit" class="text-white my-6 py-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" label="Submit Listing" />
                </form>
            </div>
        </div>
    </Dashboard>
</template>

<script>

    export default {
        middleware: 'auth',
        data(){
            return {
                loading: false,
                roles: [],
                errors: null,                
                data: {
                    name: null,
                    email: null,
                    password: null,
                    roles: null
                }
            }
        },
        methods: {                                
            async fetchRoles(){                
                let response = await this.$axios.$get('/api/roles', {limit: 100000})
                this.roles = response.data
            },
            async submitForm(){
                try {
                    this.loading = true
                    const response = await this.$axios.$put(`/api/users/${this.$route.params.slug}`, this.data)
                    this.$toast.add({severity:'success', summary: 'Saved successfully', life: 3000});
                    this.data.password = null
                }
                catch (err) {
                    console.log(err)
                    this.errors = err.response ? err.response.data.errors : err 
                    this.$toast.add({severity:'error', summary: 'Error on saving', life: 3000});
                }
                finally {
                    this.loading = false
                }
            },
            async fetchData() {
                this.loading = true
                const response = await this.$axios.$get(`/api/users/${this.$route.params.slug}`)
                this.data = {
                    name: response.name,
                    email: response.email,                    
                    roles: response.roles
                }
                this.loading = false
            }
        },
        mounted() {
            this.fetchRoles()
            this.fetchData()
        }
    }    
</script>

<style scoped>
    #select_role.v-select {
        padding: 0;
        width: 100%;             
        background-color: rgba(249, 250, 251);
        font-size: 14px;
    }
    :deep(.v-select .vs__dropdown-toggle) {
        height: 2.5rem;
        background-color: rgba(249,250,251);
    }
    :deep(.v-select .vs__search) {
        font-size: 0.9rem;
    }
    :deep(.v-select .vs__search::placeholder) {
        opacity: 0.5;
    }
</style>