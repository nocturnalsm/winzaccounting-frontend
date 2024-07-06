<template>      
    <v-row>
        <v-col cols="12">
            <UserForm 
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
                    :data="users"
                    :headers="headers"
                    :actionButtons="actionButtons"
                    :filters="filters"
                    title="Users"
                    class="font-roboto text-body-1"
                    @get-data="fetchData"
                    @add-click="handleAdd"
                    @edit-click="handleEdit"         
                    @delete-click="handleDelete"           
                    @search="handleSearch"
                    @filter="handleFilter"
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
    const edited = ref(null)    
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

        loading.value = true 
        const newParams = {
            ...fetchParams.value,
            ...params
        }
        const response = await $fetchApi('/admin/users', {
            params: newParams
        })          
        users.value = response.data        
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
