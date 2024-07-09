<template>      
    <IndexPage 
        :get-data="fetchData"    
        :headers="headers"
        title="Roles"
        :filters="filters"
        :action-buttons="actionButtons"
        :loading="loading"
    >
        <template #item.permissions="{ item }">
            <v-chip class="mr-2" color="primary" v-for="i in item.permissions.length > 3 ? 3 : item.permissions.length">
                {{ item.permissions[i - 1].name }}                            
            </v-chip>
            <v-chip color="primary" v-if="item.permissions.length > 3">
                +{{ item.permissions.length - 3 }} more
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
    
    const { user } = useAuth()
    const loading = ref(false)
    
    const headers = ref([
        {
            title: 'Name',
            key: 'name'
        },
        {
            title: 'Permissions',
            key: "permissions",
            sortable: false,
            searchable: false,
            filterable: true
        },
        {
            title: 'Users Count',
            key: "users_count",
            sortable: false,
            searchable: false
        },
        {
            title: 'Status',
            key: 'status',         
            filterable: true,
            searchable: false
        }
    ])

    const fetchData = async params => {

        const response = await $fetchApi('/admin/roles', {
            params: params
        })          
        return response
    }

    const handleEdit = data => {
        //edited.value = data.id
    }

    const actionButtons = {
        editButton: {
            show: item => {    
                if (item.system && user.role.includes('Super Admin')){
                    return true
                }
                return user.permissions.includes('roles.update')
            }
        },
        deleteButton: {
            show: item => {
                if (item.system && user.role.includes('Super Admin')){
                    return true
                }
                return user.permissions.includes('roles.delete')
            }
        }
    }

    const handleAdd = () => {
        //edited.value = ''
    }

    const handleDelete = async company => {
        try {
            const response = await $fetchApi(`/admin/roles/${company.id}`, {
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
        permissions: {
            options: [],
            placeholder: "All Permissions",
            label: "name",
            multiple: true,
            value: "id",            
        },
        status: {
            options: [],
            placeholder: "All Status",
            label: "label",
            value: "id",            
        }
    })

    onMounted(async () => {
        const responseStatus = await $fetchApi("/admin/statuses", { 
            params: { limit: - 1, sort: 'label' }
        })
        filters.value.status.options = responseStatus

        const responsePermissions = await $fetchApi("/admin/permissions", { 
            params: { limit: - 1, sort: 'name' }
        })
        filters.value.permissions.options = responsePermissions
    })

</script>
