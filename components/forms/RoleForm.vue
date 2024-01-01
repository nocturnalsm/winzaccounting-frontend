<template>
    <ModalForm 
        :title="computedTitle" 
        :visible="props.data != null"        
        :loading="loading"
        @submit="handleSubmit"
        @close="handleClose"
        :width="1024"        
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

        <v-row dense no-gutters>
            <v-col cols="12">
                <v-list-subheader>Permissions</v-list-subheader>
            </v-col>
            <v-col cols="12">
                <v-list density="compact" class="pa-0 permission-list">
                    <template v-for="item in computedPermissions">
                        <v-list-item                        
                            class="py-4 px-0"
                        >
                            <v-list-subheader class="px-0 text-capitalize">{{ item.title }}</v-list-subheader>
                            <v-row dense no-gutters>
                                <v-col class="text-body-2" v-for="permission in item.items" cols="3">
                                    <v-checkbox
                                        density="compact"
                                        hide-details                                                                    
                                        :label="permission.name"
                                    ></v-checkbox>
                                </v-col>
                            </v-row>
                        </v-list-item>
                        <v-divider></v-divider>
                    </template>
                </v-list>
            </v-col>
        </v-row>
        
    </ModalForm>
</template>

<script setup>

    import { activeCompany } from '~/store/activeCompany';
    import { ref, computed, onMounted } from 'vue'

    const statuses = ref([])
    const permissions = ref(null)
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
                status_id: props.data.status?.id,
                company_id: activeCompany.company.id
            }
            try {
                const response = await $fetchApi(`/admin/roles${param}`, {
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
                return "Add Role"
            }
            else {
                return "Edit Role"
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
        const responsePermissions = await $fetchApi('/admin/permissions', {
            params: {
                limit: -1,
                sort: 'name'
            }
        })
        permissions.value = responsePermissions.reduce((list, item) => {
            let split = item.name.split('.')    
            if (!list.hasOwnProperty(split[0])){
                list[split[0]] = Array()
            }
            list[split[0]].push(item)
            return list
        }, {})

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

    const computedPermissions = computed(() => {
        if (permissions.value){
            return Object.keys(permissions.value).map(item => {
                return {
                    title: item,
                    items: permissions.value[item]
                }
            })
        }
        return []
    })
    
</script>

<style scoped>
    :deep(.permission-list){
        height: 80%;
    }
    :deep(.permission-list .v-checkbox label.v-label) {
        font-size: 0.9rem;
    }
    :deep(.permission-list .v-checkbox .v-selection-control__input i) {
        font-size: 1.2rem;
    }
</style>