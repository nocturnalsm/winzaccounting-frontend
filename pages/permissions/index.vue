<template>      
    <v-row>
        <v-col cols="12">
            <v-card class="rounded-lg text-body-1">
                <DataTable 
                    :totalData="totalRecords"
                    :loading="loading"         
                    :data="permissions"
                    :headers="headers"
                    title="Permissions"
                    class="font-roboto text-body-1"
                    @get-data="fetchData"
                >                    
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
    
    const permissions = ref([])
    const loading = ref(false)
    const totalRecords = ref(0)
    const fetchParams = ref(null)
    
    const headers = ref([
        {
            title: 'Name',
            key: 'name'
        }
    ])

    const fetchData = async params => {

        loading.value = true        
        const response = await $fetchApi('/admin/permissions', {
            params: params
        })          
        permissions.value = response.data        
        totalRecords.value = response.total
        loading.value = false       
    }
        
</script>
