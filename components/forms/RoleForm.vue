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
            <v-col cols="12" class="pb-0">
                <v-data-table class="mt-4"
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
                    <template v-slot:top>
                        <v-text-field
                            class="pb-2"
                            v-model="search"
                            placeholder="Search"
                            clearable
                            prepend-inner-icon="mdi-magnify"
                            single-line
                            variant="outlined"
                            hide-details
                        ></v-text-field>
                    </template>
                    <template #item="{ item, isSelected, toggleSelect }">
                        <tr v-if="item.selectable.header">
                            <td class="bg-grey-lighten-3">
                                <v-checkbox hide-details density="compact" @update:modelValue="val => permissionHeaderClick(val, item.selectable.name)" v-model="item.raw.checked"/>
                            </td>
                            <td class="bg-grey-lighten-3">{{  item.selectable.name }}</td>
                        </tr>
                        <tr v-else>
                            <td></td>
                            <td>
                                <v-checkbox density="compact" @update:modelValue="ev => updateItem(item.raw)" :label="item.selectable.name" hide-details v-model="item.raw.checked">
                                    <template #label="{ label }">
                                        <span class="px-2">{{ label }}</span>
                                    </template>
                                </v-checkbox>
                            </td>
                        </tr>
                    </template>
                    <template #headers="{ columns }">
                        <tr>
                            <td width="5%">
                                <v-checkbox v-model="checkAll" @update:modelValue="handleCheckAll" hide-details density="compact" />
                            </td>
                            <td>Permissions</td>
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
    const checkAll = ref(false)
    const searchPermission = ref('')

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
                company_id: activeCompany.company.id,
                permissions: permissions.value.filter(item => !item.header && item.checked)
                                              .map(item => item.name)
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
            item = { ...item, checked: false }
            if (index > 0){
                let old_split = list[list.length - 1].name.split('.')
                if (old_split[0] !== split[0]){
                    list.push({
                        header: true,
                        name: split[0],
                        checked: props.data.id ? 
                                    responsePermissions.filter(i => i.name.startsWith(split[0] +".")).length == props.data.permissions.filter(i => i.name.startsWith(split[0] + ".")).length : false
                    })
                }
            }
            else {
                list.push({
                    header: true,
                    name: split[0],
                    checked: props.data.id ? 
                                responsePermissions.filter(i => i.name.startsWith(split[0] +".")).length == props.data.permissions.filter(i => i.name.startsWith(split[0] + ".")).length : false
                })
            }
            list.push({
                ...item,
                checked: props.data.permissions.findIndex(i => i.name == item.name) > -1
            })            
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
    
    const permissionHeaderClick = (val, start) => {        
        let indexes = permissions.value.reduce((acc, item, index) => {
            if (item.name.startsWith(start + '.')){
                acc.push(index)
            }
            return acc
        }, [])
        
        indexes.forEach(item => {
            permissions.value[item].checked = val
        })        
        if (!val){
            checkAll.value = false
        }
    }
    
    const updateItem = value => {        
        if (value.checked){
            let split = value.name.split(".")
            let index = permissions.value.findIndex(item => item.name == split[0])            
            if (index >= 0){
                permissions.value[index].checked = false
                checkAll.value = false
            }
        }
    }

    const handleCheckAll = value => {
        permissions.value.forEach((item, index) => {
            permissions.value[index].checked = value
        })
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