<template>      
    <v-row>
        <v-col cols="12">
            <CompanyForm 
                @success="handleSuccess" 
                @error="handleError" 
                @close="edited = null" 
                :data="edited" 
            />
            <v-card class="rounded-lg text-body-1">
                <DataTable 
                    :totalData="totalRecords"
                    :loading="loading"         
                    :data="companies"
                    :headers="headers"
                    title="Companies"
                    class="font-roboto text-body-1"
                    @get-data="fetchData"
                    @add-click="handleAdd"
                    @edit-click="handleEdit"         
                    @delete-click="handleDelete"  
                    @search="handleSearch"
                >
                    <template #item.type="{ item }">
                        {{ item.type.type }}
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
    
    const companies = ref([])
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
            title: 'Company Type',
            key: 'type'
        }
    ])

    const fetchData = async params => {

        loading.value = true        
        const newParams = {
            ...fetchParams.value,
            ...params
        }
        const response = await $fetchApi('/admin/companies', {
            params: newParams
        })          
        companies.value = response.data        
        totalRecords.value = response.total
        fetchParams.value = newParams
        loading.value = false       
    }

    const handleEdit = data => {
        const { id, name, type, tax_number, url, status } = data
        edited.value = { id, name, type, tax_number, url, status }
    }

    const actionButtons = {
        editButton: {
            show: item => {
                return user.permissions.includes('companies.update')
                    && user.companies.findIndex(c => c.id == item.id) >= 0
            }
        },
        deleteButton: {
            show: item => {
                return user.permissions.includes('companies.delete')
                    && user.companies.findIndex(c => c.id == item.id) >= 0
            }
        }
    }

    const handleSearch = search => {
        let params = { 
            filter: search ? {
                ...filter,
                name: search,
                company_type: search
            }
            : null
        }
        fetchData(params)
    }
    
    const handleAdd = () => {
        edited.value = {
            name: '',
            type: null,
            tax_number: '',
            url: '',
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
            const response = await $fetchApi(`/admin/companies/${company.id}`, {
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
</script>
