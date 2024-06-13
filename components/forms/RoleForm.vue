<template>
    <v-card     
        :visible="data != null"        
        :loading="loading"
        @submit="handleSubmit"
        class="rounded-lg text-body-1"
        :disabled="loading"
    >            
        <v-toolbar dense>               
            <v-toolbar-title>{{ computedTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="handleClose" class="ms-5">
                <v-icon icon="mdi-check"></v-icon>
                <span class="d-none d-md-inline ms-1">Save</span>
            </v-btn>
            <v-btn @click="handleClose" class="ms-5" icon="mdi-close"></v-btn>            
        </v-toolbar>
        <v-row class="mt-0">        
            <v-col cols="12" md="3">
                <v-sheet
                    class="pa-4 text-center"
                    color="grey-lighten-4"                    
                >
                    <Avatar v-bind="computedAvatar" :size="80" />

                    <div v-if="data.name" class="mt-4">{{ data.name }}</div>
                    <v-chip v-if="data.status" :color="data.status.color">
                        {{ data.status.label }}
                    </v-chip>
                </v-sheet>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item                    
                    v-for="[icon, text] in links"
                        :key="icon"
                        :prepend-icon="icon"
                        :title="text"
                        link
                    ></v-list-item>
                </v-list>
            </v-col>
            <v-col cols="12" md="9" class="pa-8 pb-10 pe-8">    
                <v-row dense no-gutters>
                    <v-col cols="12" md="4">
                        <v-list-subheader>Name</v-list-subheader>
                    </v-col>

                    <v-col cols="12" md="8">
                        <v-text-field
                            autofocus
                            variant="underlined"
                            label="Name"
                            v-model="data.name"
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
                            variant="underlined"
                            label="Status"
                            :items="statuses"
                            item-title="label"
                            item-value="id"
                            v-model="data.status" 
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
            </v-col>
        </v-row>
    </v-card>
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
        dataId: {
            default: null
        }
    })
    const checkAll = ref(false)
    const searchPermission = ref('')

    const emits = defineEmits(['success', 'error', 'close'])        
    const headers = [
        { key: 'name', title: 'Permissions' }
    ]

    const data = ref({
        id: '',
        name: '',            
        status: null,
        permissions: []
    })

    const handleSubmit = async () => {
        if (data.value){
            let param = data.value.id ? `/${data.value.id}` : ''        
            loading.value = true        
            errors.value = null
            let submit = {
                ...data.value,
                status_id: data.value.status?.id,
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
        if (data.value){
            if (!data.value.id){
                return "Add Role"
            }
            else {
                return "Edit Role"
            }
        }
    })

    const links = [
        ['mdi-account-card', 'Role Information'],
        ['mdi-account', 'Users']
    ]

    onMounted(async () => {    
        if (props.dataId){
            const responseRole = await $fetchApi(`/admin/roles/${props.dataId}`)
            data.value = responseRole
        }
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
                        checked: data.value.id ? 
                                    responsePermissions.filter(i => i.name.startsWith(split[0] +".")).length == data.value.permissions.filter(i => i.startsWith(split[0] + ".")).length : false
                    })
                }
            }
            else {
                list.push({
                    header: true,
                    name: split[0],
                    checked: data.value.id ? 
                                responsePermissions.filter(i => i.name.startsWith(split[0] +".")).length == data.value.permissions.filter(i => i.startsWith(split[0] + ".")).length : false
                })
            }
            list.push({
                ...item,
                checked: data.value.permissions.findIndex(i => i == item.name) > -1
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

    const computedAvatar = computed(() => {
        if (data.value.name){
            let names = data.value.name.split("_")
            return { label: names[0].substr(0,1) + (names.length > 1 ? names[1].substr(0,1) : '') }
        }
        return { label: "R" }
    })

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