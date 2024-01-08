<template>
    <ModalForm 
        :title="computedTitle" 
        :visible="props.data != null"        
        :loading="loading"
        @submit="handleSubmit"
        @close="handleClose"
        :width="800"        
    >    
        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Account Type</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-autocomplete
                    density="compact"
                    label="Account Type"
                    :items="account_types"
                    v-model="props.data.type"
                    item-title="name"
                    item-value="id"
                    return-object
                    hide-details="auto"
                    :error-messages="handleError('type')"
                ></v-autocomplete>
            </v-col>
        </v-row>
        
        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Account Number</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    autofocus
                    density="compact"
                    label="Account Number"
                    v-model="props.data.number"
                    hide-details="auto"
                    :error-messages="handleError('number')"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Account Name</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    density="compact"
                    label="Account Name"
                    v-model="props.data.name"     
                    hide-details="auto"
                    :error-messages="handleError('name')"
                ></v-text-field>
            </v-col>
        </v-row>        
        
        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Parent Account</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-autocomplete
                    density="compact"
                    label="Parent Account"
                    :items="parents"
                    v-model="props.data.parent"
                    item-title="name"
                    item-value="id"                    
                    return-object
                    hide-details="auto"
                ></v-autocomplete>
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

    const parents = ref([])
    const account_types = ref([])
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
                status_id: props.data.status?.id
            }
            try {
                const response = await $fetchApi(`/admin/accounts${param}`, {
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
                return "Add Account"
            }
            else {
                return "Edit Account"
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

        const responseTypes = await $fetchApi('/setup/accounts/types');
        account_types.value = responseTypes
        
    })

    const getParents = async () => {
        const responseParents = await $fetchApi('/setup/accounts/parents', {
            params: {
                id: props.data.id
            }
        })
        account_parents.value = responseParents
    }

    const handleError = field => {
        if (errors.value){
            let isError = errors.value.hasOwnProperty(field)
            if (isError){
                return errors.value[field]
            }
        }
        return ''
    }

    const computedHint = computed(() => {
        if (props.data.id){
            return 'Keep this empty if you do not want to change the password'
        }
        return ''
    })

</script>