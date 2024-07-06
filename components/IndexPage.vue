<template>      
    <v-row>
        <v-col cols="12">
            <v-card class="rounded-lg text-body-2">
                <DataTable 
                    :totalData="props.totalRecords"
                    :loading="props.loading"         
                    :data="props.data"
                    :headers="props.headers"
                    :filters="props.filters"
                    :actionButtons="props.actionButtons"
                    :title="props.title"
                    class="font-roboto"
                    @get-data="fetchData"
                    @add-click="handleAdd"
                    @edit-click="handleEdit"         
                    @delete-click="handleDelete"  
                    @search="handleSearch"
                    @filter="handleFilter"
                >           
                </DataTable>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
    
    import { ref } from 'vue'
    
    const emit = defineEmits(['add-click', 'edit-click', 'delete-click', 'get-data'])
    const props = defineProps({
        data: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            default: ''
        },
        headers: {
            type: Array,
            default: []
        },
        loading: {
            type: Boolean,
            default: false
        },
        totalRecords: {
            type: Number,
            default: 0
        },
        filters: {
            type: Object,
            required: false
        }
    })    
    const fetchParams = ref(null)
        
    const fetchData = params => {

        const newParams = {
            ...fetchParams.value,
            ...params
        }
        fetchParams.value = newParams
        nextTick(() => {
            emit('get-data', newParams)
        })
               
    }

    const handleAdd = () => {
        emit('add-click')
    }

    const handleEdit = data => {
        emit('edit-click', data)
    }

    const handleSearch = search => {        
        let params = { 
            q: search ?? null
        }
        fetchData(params)
    }

    const handleDelete = data => {
        emit('delete-click', data)        
    }
    
    const handleFilter = ({ value, key }) => {        
        let { filter } = fetchParams.value
        let newFilter = filter ? { filter } : {}       
        let params = null
        if (value){ 
            if (value.multiple){                
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
