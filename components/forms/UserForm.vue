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
                <v-list-subheader>Username</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    density="compact"
                    label="Username"
                    v-model="props.data.username"     
                    hide-details="auto"
                    :error-messages="handleError('username')"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Email</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field
                    density="compact"
                    type="email"
                    label="Email address"
                    v-model="props.data.email" 
                    hide-details="auto"         
                    :error-messages="handleError('email')"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Company</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-autocomplete
                    density="compact"
                    label="Company"
                    :items="companies"
                    v-model="props.data.companies"
                    item-title="name"
                    item-value="id"
                    multiple
                    chips
                    return-object
                    hide-details="auto"
                    :error-messages="handleError('companies')"
                ></v-autocomplete>
            </v-col>
        </v-row>

        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Roles</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-autocomplete
                    density="compact"
                    label="Roles"
                    :items="roles"
                    v-model="props.data.roles"
                    item-title="name"
                    item-value="id"
                    multiple
                    return-object
                    chips
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
        <v-row dense no-gutters>
            <v-col cols="12" md="4">
                <v-list-subheader>Password</v-list-subheader>
            </v-col>

            <v-col cols="12" md="8">
                <v-text-field            
                    density="compact"        
                    label="Password"
                    v-model="props.data.password"     
                    :append-inner-icon="password_visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="password_visible ? 'text' : 'password'"    
                    @click:append-inner="password_visible = !password_visible" 
                    :hint="computedHint"
                    hide-details="auto"
                    :error-messages="handleError('password')"
                ></v-text-field>
            </v-col>
        </v-row>
    </ModalForm>
</template>

<script setup>

    import { ref, computed, onMounted } from 'vue'

    const roles = ref([])
    const companies = ref([])
    const password_visible = ref(false)
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
                roles: props.data.roles.map(item => {
                    return item.name
                }),
                companies: props.data.companies?.map(item => item.id),
                status_id: props.data.status?.id
            }
            try {
                const response = await $fetchApi(`/admin/users${param}`, {
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
                return "Add User"
            }
            else {
                return "Edit User"
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

        const responseRoles = await $fetchApi('/admin/roles', {
            params: {
                limit: -1,
                sort: 'name'
            }
        })
        roles.value = responseRoles

        const responseCompanies = await $fetchApi('/admin/companies', {
            params: {
                limit: -1,
                sort: 'name'
            }
        })
        companies.value = responseCompanies
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

    const computedHint = computed(() => {
        if (props.data.id){
            return 'Keep this empty if you do not want to change the password'
        }
        return ''
    })

</script>