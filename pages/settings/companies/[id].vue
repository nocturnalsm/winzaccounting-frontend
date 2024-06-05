<template>
    <ModalForm 
        :title="computedTitle" 
        :loading="loading"
        @submit="handleSubmit"
        @close="handleClose"
    >    
        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Name</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    autofocus
                    density="compact"
                    label="Name"
                    v-model="props.data.name"
                    hide-details="auto"
                    :error-messages="handleError('name')"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Company Type</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-autocomplete
                    density="compact"
                    label="Company Type"
                    :items="company_types"
                    item-title="type"
                    item-value="id"
                    v-model="props.data.type" 
                    hide-details="auto"                 
                    :error-messages="handleError('company_type')"  
                    return-object
                >
                </v-autocomplete>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Tax Number</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    density="compact"
                    label="Tax Number"
                    v-model="props.data.tax_number"
                    hide-details="auto"                    
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>URL</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    density="compact"
                    label="URL"
                    v-model="props.data.url"
                    hide-details="auto"                    
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Status</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-autocomplete
                    density="compact"
                    label="Status"
                    :items="statuses"
                    item-title="label"
                    item-value="id"
                    v-model="props.data.status" 
                    hide-details="auto"                 
                    :error-messages="handleError('status_id')"  
                    return-object
                >
                </v-autocomplete>
            </v-col>
        </v-row>
        
    </ModalForm>
</template>

<script setup>

    import { ref, computed, onMounted } from 'vue'

    const company_types = ref([])
    const statuses = ref([])
    const errors = ref(null)
    const loading = ref(false)
    const props = defineProps({
        data: {
            type: Object,
            default: null
        }
    })
    
    const emits = defineEmits(['success', 'error', 'close'])        

    const handleSubmit = async () => {
        if (props.data){
            let param = props.data.id ? `/${props.data.id}` : ''        
            loading.value = true        
            errors.value = null
            let submit = {
                ...props.data,
                company_type: props.data.type?.id,
                status_id: props.data.status?.id
            }
            console.log(submit)
            try {
                const response = await $fetchApi(`/admin/companies${param}`, {
                    method: submit.id ? 'PUT' : 'POST',
                    body: submit
                })
                emits('success', submit)
            }
            catch (err){       
                errors.value = err.response ? err.response._data.errors : {}
                emits('error', errors)
            }
            finally {
                loading.value = false
            }
        }
    }

    const handleClose = () => {
        emits('close')
    }

    const computedTitle = computed(() => {
        if (props.data){
            if (!props.data.id){
                return "Add Company"
            }
            else {
                return "Edit Company"
            }
        }
    })

    onMounted(async () => {    
        const responseStatus = await $fetchApi('/admin/statuses', {
            params: {
                limit: -1
            }
        })
        statuses.value = responseStatus.map(item => {            
            return {
                id: item.id,
                status: item.status,
                label: item.label
            }
        })

        const responseTypes = await $fetchApi('/admin/companies/types', {
            params: {
                limit: -1,
                sort: 'type'
            }
        })
        company_types.value = responseTypes

    })

    const handleError = field => {
        if (errors.value){
            let isError = errors.value.hasOwnProperty(field)
            if (isError){
                return errors.value[field]
            }
        }
        return ''
    }
    
</script>