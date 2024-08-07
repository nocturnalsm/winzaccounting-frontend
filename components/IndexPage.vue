<template>      
    <v-row class="mt-16">
        <v-col cols="12">
            <v-card :loading="props.loading" class="rounded-lg text-body-1 my-2 mx-4">
                <slot name="table">
                    <DataTable 
                        :totalData="totalRecords"
                        :loading="loadingData"         
                        :data="data"
                        :headers="props.headers"
                        :actionButtons="props.actionButtons"
                        :filters="props.filters"
                        :title="props.title"
                        class="font-roboto text-body-1"
                        @get-data="fetchData"
                        @add-click="handleAdd"
                        @edit-click="handleEdit"         
                        @delete-click="handleDelete"           
                        @search="handleSearch"
                        @filter="handleFilter"
                    >
                        <template v-for="(slot, index) of getItemSlots($slots)" v-slot:[slot]="{ item }">
                            <slot :name="slot" :item="item"></slot>
                        </template>
                    </DataTable>
                </slot>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup>
    
    import { ref } from 'vue'

    const data = ref([])
    const loadingData = ref(false)
    const totalRecords = ref(0)
    const fetchParams = ref(null)
    const emits = defineEmits(['add-click', 'edit-click', 'delete-click'])

    const props = defineProps({
        loading: {
            type: Boolean,
            default: false
        },
        getData: {
            type: Function
        },
        title: {
            type: String
        },
        headers: {
            type: Array,
            required: true
        },
        filters: {
            type: Object,
            required: false
        },
        actionButtons: {
            type: [Function, Object],
            required: false
        }
    })
    
    const fetchData = async params => {

        loadingData.value = true 
        const newParams = {
            ...fetchParams.value,
            ...params
        }
        const response = await props.getData(params)
        data.value = response.data        
        totalRecords.value = response.total
        fetchParams.value = newParams
        loadingData.value = false       
    }

    const handleEdit = data => {        
        emits('edit-click', data)
    }       

    const handleSearch = search => {        
        let params = { 
            q: search ?? null
        }
        fetchData(params)
    }

    const handleAdd = () => {
        emits('add-click')
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

    const handleFilter = ({ value, key }) => {        
        let { filter } = fetchParams.value
        let newFilter = filter ? { filter } : {}       
        let params = null

        if (value){             
            if (props.filters[key].multiple ?? false){                
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

    const getItemSlots = slots => {
        return Object.keys(slots).filter(i => i.startsWith('item.'))
    }

</script>