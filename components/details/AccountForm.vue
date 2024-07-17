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
                    autofocus
                    item-title="name"
                    item-value="id"
                    return-object
                    hide-details="auto"
                    :clearable="false"
                    @update:model-value="handleTypeChange"
                    :error-messages="handleError('type')"
                ></v-autocomplete>
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
                    item-title="numbername"
                    item-value="id"                    
                    return-object
                    hide-details="auto"
                    clearable
                >                    
                    <template #selection="{ item }">
                        <span class="font-weight-bold mr-2">{{ item.value.completenumber }}</span>
                        <span>{{  item.value.name }}</span>
                    </template>
                    <template #item="{ props, item }">
                        <v-list-item v-bind="props">
                            <template #title>
                                <span class="font-weight-bold mr-2">{{ item.raw.completenumber }}</span>
                                <span>{{  item.raw.name }}</span>
                            </template>
                        </v-list-item>
                    </template>
                </v-autocomplete>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Account Number</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    density="compact"
                    label="Account Number"
                    v-model="props.data.number"
                    hide-details="auto"
                    :prefix="computedPrefix"
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
    import { activeCompany } from '~/store/activeCompany';

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
            let submit = props.data.id ? { id: props.data.id } : {} 
            submit = {
                ...submit,
                company_id: activeCompany.company.id,
                status_id: props.data.status?.id,
                account_type: props.data.type?.id,
                parent: props.data.parent?.id,
                number: props.data.parent.number + props.data.number,
                name: props.data.name
            }            
            try {
                const response = await $fetchApi(`/setup/accounts${param}`, {
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

        if (props.data.id){            
            getParents()
        }
        
    })

    const getParents = async () => {
        const responseParents = await $fetchApi('/setup/accounts/parents', {
            params: {
                id: props.data.id ?? null,
                type: props.data.type.id,
                company_id: activeCompany.id
            }
        })
        parents.value = responseParents.map(item => {
            return {
                ...item,
                completenumber: item.type.prefix + '-' + item.number,
                numbername: item.type.prefix + '-' + item.number + ' ' + item.name,
            }
        })
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

    const computedPrefix = computed(() => {
        let prefix = props.data.type ? props.data.type.prefix : ''
        let parent = props.data.parent !== null ? props.data.parent.number : ''
        let all = prefix + '-' + parent
        return all == '-' ? '' : all
    })

    const handleTypeChange = value => {
        parents.value = []
        props.data.parent = null
        if (value){
            getParents(props.data.id ?? null)
        }
    }
</script>