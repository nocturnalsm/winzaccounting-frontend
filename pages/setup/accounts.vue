<template>      
    <v-row>
        <v-col cols="12">
            <AccountForm 
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
                    :data="accounts"
                    :headers="headers"
                    :actionButtons="actionButtons"
                    title="Accounts"
                    class="font-roboto text-body-1"
                    @get-data="fetchData"
                    @add-click="handleAdd"
                    @edit-click="handleEdit"         
                    @delete-click="handleDelete"           
                    @search="handleSearch"
                    hide-default-footer                    
                >               
                    <template #item.number="{ item }">
                        <span :class="`${item.depth == 0 ? 'font-weight-bold' : ''}`" v-if="fetchParams.filter.length > 1 && fetchParams.filter">
                            {{ item.prefix }}{{ item.number }}
                        </span>
                        <span :class="`${item.depth == 0 ? 'font-weight-bold' : ''}`" v-else>
                            {{ ('&#9472;').repeat(item.depth) }} {{ item.prefix }}{{ item.number }}
                        </span>
                    </template>                    
                    <template #item.status="{ item }">
                        <v-chip :color="item.status.color">
                            {{ item.status.label }}
                        </v-chip>
                    </template>     
                    <template #bottom>
                        <div>
                            <v-card-text>{{ accounts.length }} records</v-card-text>
                        </div>
                    </template>    
                    <template #actionButtons="{ item }">
                        <v-btn                                            
                            class="order-0"
                            title="View"
                            color="default"
                            icon="mdi-eye"
                            variant="text"
                            density="comfortable"
                        />
                    </template>
                </DataTable>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
    
    import { activeCompany } from '~/store/activeCompany';
    import { ref } from 'vue'

    definePageMeta({
        middleware: 'auth',
        layout: 'admin'
    })
    
    const accounts = ref([])
    const loading = ref(false)
    const totalRecords = ref(0)
    const fetchParams = ref(null)
    const edited = ref(null)
    const { user } = useAuth()

    const headers = ref([
        {
            title: 'Number',
            key: 'number',
            sortable: false
        },
        {
            title: 'Name',
            key: 'name',
            sortable: false
        },
        {
            title: 'Type',
            key: 'accountType',
            sortable: false
        },
        {
            title: 'Balance',
            key: 'balance',
            sortable: false            
        },
        {
            title: 'Status',
            key: 'status',
            sortable: false            
        }
    ])

    const fetchData = async params => {

        loading.value = true 
        const newParams = {
            ...fetchParams.value,            
            ...params,
            limit: -1,
            sort: 'number',
            filter: {
                company_id: activeCompany.company.id
            }
        }
        
        const response = await $fetchApi('/setup/accounts', {
            params: newParams
        })          
        accounts.value = response        
        totalRecords.value = response.length
        fetchParams.value = newParams
        loading.value = false       
    }

    const handleEdit = data => {
        const { id, number, name, account_type, accountType, prefix, status, parent } = data
        let type = {
            id: account_type,
            name: accountType,
            prefix: prefix
        }
        let editParent = parent ? {
            ...parent,
            completenumber: prefix + parent.number,
            numbername: prefix + parent.number + ' ' + name,
        } : null
        let editNumber = number.substring(parent? parent.number.length : 1)
        edited.value = { id, number: editNumber, name, type, status, parent: editParent }
    }   

    const actionButtons = {
        editButton: {
            show: user.permissions.includes('accounts.update'),
            order: 1
        },
        deleteButton: {
            show: user.permissions.includes('accounts.delete'),
            order: 2
        }
    }

    const handleSearch = search => {        
        let params = { 
            filter: search ? {                
                name: search,
                number: search,
                type: search,
                status: search
            } 
            : null
        }
        fetchData(params)
    }

    const handleAdd = () => {
        edited.value = {
            number: '',
            name: '',
            type: null,
            status: null,
            parent: null
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

    const handleDelete = async user => {
        try {
            const response = await $fetchApi(`/setup/accounts/${account.id}`, {
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
