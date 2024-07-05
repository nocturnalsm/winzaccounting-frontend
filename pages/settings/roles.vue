<template>      
    <v-row>
        <v-col cols="12">
            <RoleForm 
                v-if="edited != null"
                @success="handleSuccess" 
                @error="handleError" 
                @close="edited = null" 
                :data-id="edited" 
            />
            <v-card v-else class="rounded-lg text-body-1">
                <DataTable 
                    :totalData="totalRecords"
                    :loading="loading"         
                    :data="roles"
                    :headers="headers"
                    :filters="filters"
                    :actionButtons="actionButtons"
                    title="Roles"
                    class="font-roboto text-body-1"
                    @get-data="fetchData"
                    @add-click="handleAdd"
                    @edit-click="handleEdit"         
                    @delete-click="handleDelete"  
                    @search="handleSearch"
                    @filter="handleFilter"
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
    const roles = ref([])
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

        loading.value = true        
        const newParams = {
            ...fetchParams.value,
            ...params
        }
        const response = await $fetchApi('/admin/roles', {
            params: newParams
        })          
        roles.value = response.data        
        totalRecords.value = response.total
        fetchParams.value = newParams
        loading.value = false       
    }

    const handleEdit = data => {
        edited.value = data.id
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

    const handleSearch = search => {        
        let params = { 
            q: search ?? null
        }
        fetchData(params)
    }
    
    const handleAdd = () => {
        edited.value = ''
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

    const handleFilter = ({ value, key }) => {        
        let { filter } = fetchParams.value
        let newFilter = filter ? { filter } : {}       
        let params = null
        if (value){ 
            if (key == 'permissions'){                
                params = {
                    filter: { ...newFilter.filter, [key]: value.map(i => i.value) }
                }
            }
            else {
                params = {
                    filter: { ...newFilter.filter, [key]: value.value }
                }
            }
        }        
        else {
            delete newFilter.filter[key]
            params = { filter: newFilter.filter }
        }
        fetchData(params)
    }
</script>
