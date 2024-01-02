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

        <v-row dense no-gutters class="pb-0">
            <v-col cols="12" class="mt-8 pb-0">
                <v-data-table
                    :headers="headers"
                    :items="permissions"
                    :search="search"
                    :items-per-page="-1"
                    show-select
                    density="compact"
                    height="350px"                           
                    sticky             
                >
                    <template v-slot:bottom></template>
                    <template #item="{ item, isSelected, toggleSelect }">
                        <tr>
                            <td :class="item.selectable.header ? 'bg-grey-lighten-3' : null">
                                <v-checkbox hide-details density="compact" :v-model="isSelected" />
                            </td>
                            <td :class="item.selectable.header ? 'bg-grey-lighten-3' : null">{{  item.selectable.name }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
        
    </ModalForm>
</template>

<script setup>

    import { activeCompany } from '~/store/activeCompany';
    import { ref, computed, onMounted } from 'vue'

    const statuses = ref([])
    const permissions = ref([])
    const errors = ref(null)
    const loading = ref(false)
    const search = ref('')
    const props = defineProps({
        data: {
            type: Object,
            default: null
        }
    })
    
    const emits = defineEmits(['success', 'error', 'close'])        
    const headers = [
        { key: 'name', title: 'Permissions' }
    ]

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
        
        permissions.value = responsePermissions.reduce((list, item, index) => {
            let split = item.name.split('.')    
            if (index > 0){
                let old_split = list[list.length - 1].name.split('.')
                if (old_split[0] !== split[0]){
                    list.push({
                        header: true,
                        name: split[0]
                    })
                }
            }
            else {
                list.push({
                    header: true,
                    name: split[0]
                })
            }
            list.push(item)
            return list
        }, [])

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

<style scoped>
    :deep(.permission-list .v-checkbox label.v-label) {
        font-size: 0.9rem;
    }
    :deep(.permission-list .v-checkbox .v-selection-control__input i) {
        font-size: 1.2rem;
    }
</style>