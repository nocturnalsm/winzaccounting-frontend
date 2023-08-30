<template>      
    <v-row>
        <v-col cols="12">
            <v-card class="rounded-lg text-body-1">
                <DataTable 
                    :totalData="totalRecords"
                    :loading="loading"         
                    :data="roles"
                    :headers="headers"
                    title="Roles"
                    class="font-roboto text-body-1"
                    @get-data="fetchData"
                    @search="handleSearch"
                >                    
                    <template #item.permissions="{ item }">
                        <v-chip class="mr-2" color="primary" v-for="permission in item.permissions">
                            {{ permission.name }}
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
    
    const roles = ref([])
    const loading = ref(false)
    const totalRecords = ref(0)
    const fetchParams = ref(null)
    
    const headers = ref([
        {
            title: 'Name',
            key: 'name'
        },
        {
            title: 'Permissions',
            key: "permissions",
            sortable: false
        },
        {
            title: 'Users Count',
            key: "users_count",
            sortable: false,
            searchable: false
        }
    ])

    const fetchData = async params => {

        loading.value = true        
        const response = await $fetchApi('/admin/roles', {
            params: params
        })          
        roles.value = response.data        
        totalRecords.value = response.total
        fetchParams.value = params
        loading.value = false       
    }

    const handleSearch = search => {
        let { filter, rest } = fetchParams.value
        let params = { 
            ...rest,
            filter: {
                ...filter,
                name: search,
                permissions: search
            }
        }
        fetchData(params)
    }
</script>
