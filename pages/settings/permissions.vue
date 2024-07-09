<template>      
    <IndexPage 
        :get-data="fetchData"    
        :headers="headers"
        title="Permissions"
        :filters="filters"
        :action-buttons="actionButtons"
        :loading="loading"
    >                    
        <template #item.permissions="{ item }">
            <v-chip class="mr-2" color="primary" v-for="permission in item.permissions">
                {{ permission.name }}
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
            title: 'Status',
            key: 'status',           
            searchable: false,
            filterable: true 
        }
    ])

    const fetchData = async params => {

        const response = await $fetchApi('/admin/permissions', {
            params: params
        })          
        return response       
    }

    const handleEdit = data => {
        //const { id, name, status } = data
        //edited.value = { id, name, status }
    }

    const actionButtons = {
        editButton: {
            show: item => {
                return user.permissions.includes('permissions.update')
            }
        },
        deleteButton: {
            show: item => {
                return user.permissions.includes('permissions.delete')
            }
        }
    }

    const handleAdd = () => {
        
        
    }

    
    const handleDelete = async company => {
        try {
            const response = await $fetchApi(`/admin/permissions/${company.id}`, {
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
        }
    })

    onMounted(async () => {
        const responseStatus = await $fetchApi("/admin/statuses", { 
            params: { limit: - 1, sort: 'label' }
        })
        filters.value.status.options = responseStatus
    })
    
</script>
