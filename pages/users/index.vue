<template>      
    <v-row>
        <v-col cols="12">
            <v-card class="rounded-lg text-body-1">
                <DataTable 
                    :totalData="totalRecords"
                    :loading="loading"         
                    :data="users"
                    :headers="headers"
                    title="Users"
                    class="font-roboto text-body-1"
                    @get-data="fetchData"
                    @edit-click="handleEdit"
                    :actionButtons="actionButtons"
                    @search="handleSearch"
                >
                    <template #item.roles="{ item }">
                        <v-chip color="primary" v-for="role in item.roles">
                            {{ role.name }}
                        </v-chip>
                    </template>
                    <template #item.status="{ item }">
                        <v-chip :color="item.status.color">
                            {{ item.status.label }}
                        </v-chip>
                    </template>
                </DataTable>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
    
    import { ref } from 'vue'

    definePageMeta({
        middleware: 'auth',
        layout: 'admin'
    })
    
    const users = ref([])
    const loading = ref(false)
    const totalRecords = ref(0)
    const fetchParams = ref(null)
    
    const headers = ref([
        {
            title: 'Name',
            key: 'name'
        },
        {
            title: 'Username',
            key: 'username'
        },
        {
            title: 'Email',
            key: 'email'
        },
        {
            title: 'Roles',
            key: 'roles',
            sortable: false
        },
        {
            title: 'Status',
            key: 'status',            
        }
    ])

    const fetchData = async params => {

        loading.value = true        
        const response = await $fetchApi('/admin/users', {
            params: params
        })          
        users.value = response.data        
        totalRecords.value = response.total
        fetchParams.value = params
        loading.value = false       
    }

    const handleEdit = data => {
        console.log(data)
    }   

    const actionButtons = {
        editButton: {
            show: item => {
                let super_admin = item.roles.find(item => item.name == 'Super Admin')
                return !super_admin
            },
            order: 1
        },
        deleteButton: {
            show: item => {
                let super_admin = item.roles.find(item => item.name == 'Super Admin')
                return !super_admin
            },
            order: 2
        }
    }

    const handleSearch = search => {
        let { filter, rest } = fetchParams.value
        let params = { 
            ...rest,
            filter: {
                ...filter,
                name: search,
                username: search,
                email: search,
                roles: search,
                status: search
            }
        }
        fetchData(params)
    }
</script>
