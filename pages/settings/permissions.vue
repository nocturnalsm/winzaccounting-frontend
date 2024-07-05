<template>      
    <v-row>
        <v-col cols="12">
            <PermissionForm 
                v-if="edited"
                @success="handleSuccess" 
                @error="handleError" 
                @close="edited = null" 
                :data="edited" 
            />
            <v-card class="rounded-lg text-body-1">
                <DataTable 
                    :totalData="totalRecords"
                    :loading="loading"         
                    :data="permissions"
                    :headers="headers"
                    :actionButtons="actionButtons"
                    :filters="filters"
                    title="Permissions"
                    class="font-roboto text-body-1"
                    @get-data="fetchData"
                    @add-click="handleAdd"
                    @edit-click="handleEdit"         
                    @delete-click="handleDelete"  
                    @search="handleSearch"
                    @filter="handleFilter"
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
    
    const { user } = useAuth()
    const permissions = ref([])
    const loading = ref(false)
    const totalRecords = ref(0)
    const fetchParams = ref(null)
    const edited = ref(null)
    
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

        loading.value = true        
        const newParams = {
            ...fetchParams.value,
            ...params
        }
        const response = await $fetchApi('/admin/permissions', {
            params: newParams
        })          
        permissions.value = response.data        
        totalRecords.value = response.total
        fetchParams.value = newParams
        loading.value = false       
    }

    const handleEdit = data => {
        const { id, name, status } = data
        edited.value = { id, name, status }
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

    const handleSearch = search => {        
        let params = { 
            q: search ?? null
        }
        fetchData(params)
    }
    
    const handleAdd = () => {
        edited.value = {
            name: '',            
            status: null
        }
    }

    const handleSuccess = data => {      
        $toast({
            message: 'Record saved',
            state: 'success'
        })
        fetchData()
        edited.value = null
    }

    const handleError = error => {            
        $toast({
            message: 'Error occured on saving. Please try again',
            state: 'error'
        })
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

    const handleFilter = ({ value, key }) => {        
        let { filter } = fetchParams.value
        let newFilter = filter ? { filter } : {}       
        let params = null
        if (value){ 
            params = {
                filter: { ...newFilter.filter, [key]: value.value }
            }
        }
        else {
            delete newFilter.filter[key]
            params = { filter: newFilter.filter }
        }
        fetchData(params)
    }
</script>
