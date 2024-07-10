<template>      
    <IndexPage 
        :get-data="fetchData"    
        :headers="headers"
        title="Users"
        :filters="filters"
        :action-buttons="actionButtons"
        :loading="loading"
        @add-click="handleAdd"
        @edit-click="handleEdit"
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

    definePageMeta({
        middleware: 'auth',
        layout: 'admin'
    })
    
    const loading = ref(false)
    const { user } = useAuth()

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
       
        const response = await $fetchApi('/admin/users', {
            params: params
        })          

        return response
    }

    const handleEdit = data => {        
        useRouter().push({ name: 'settings-users-id', params: { id: data.id } })
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
        useRouter().push({ name: 'settings-users-new' })
    }

    const handleDelete = async user => {
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
