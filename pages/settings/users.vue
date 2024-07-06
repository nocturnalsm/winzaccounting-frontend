<template>          
    <IndexPage 
        :total-records="totalRecords"
        :loading="loading"         
        :data="users"
        :headers="headers"
        :actionButtons="actionButtons"
        :filters="filters"
        title="Users"
        @get-data="fetchData"
        @add-click="handleAdd"
        @edit-click="handleEdit"         
        @delete-click="handleDelete"
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
    </IndexPage>
</template>

<script setup>
    
    import { ref } from 'vue'

    const users = ref([])
    const loading = ref(false)
    const totalRecords = ref(0)
    const { user } = useAuth()

    definePageMeta({
        middleware: 'auth',
        layout: 'admin'
    })

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
            sortable: false,
            searchable: false,
            filterable: true
        },
        {
            title: 'Status',
            key: 'status',  
            searchable: false,
            filterable: true          
        }
    ])

    const fetchData = async params => {        
        loading.value = true 
        const response = await $fetchApi('/admin/users', {
            params: params
        })                  
        users.value = response.data        
        totalRecords.value = response.total        
        loading.value = false       
    }

    const handleEdit = data => {        
        
    }   

    const actionButtons = {

        editButton: {
            show: item => {
                let super_admin = item.roles.find(item => item.name == 'Super Admin')
                if (super_admin){
                    return user.id == item.id
                }
                return !super_admin
            },
            order: 1
        },
        deleteButton: {
            show: item => {
                let super_admin = item.roles.find(item => item.name == 'Super Admin')
                if (super_admin){
                    return user.id == item.id
                }
                return !super_admin
            },
            order: 2
        }
    }

    const handleAdd = () => {
        //edited.value = ''
    }

    const handleDelete = async user => {
        loading.value = true
        try {
            const response = await $fetchApi(`/admin/users/${user.id}`, {
                method: "DELETE"
            })
            $toast({
                message: "Data has been successfully deleted",
                state: 'success'
            })
            fetchData()
        }
        catch (err){
            $toast({
                message: err.response ? err.response._data.message : "Error on deleting. Please try again",
                state: 'error'
            })
        }
    }

    const filters = ref({
        status: {
            options: [],
            placeholder: "All Status",
            label: "label",
            value: "id",            
        },
        roles: {
            options: [],
            placeholder: "All Roles",
            label: "name",
            value: "id"
        }
    })

    onMounted(async () => {
        const responseStatus = await $fetchApi("/admin/statuses", { 
            params: { limit: - 1, sort: 'label' }
        })
        filters.value.status.options = responseStatus
        
        const responseRoles = await $fetchApi("/admin/roles", { 
            params: { limit: - 1 }
        })
        filters.value.roles.options = responseRoles
    })
   
</script>
