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
                    <Avatar :label="oldData?.name" :size="80" />

                    <div v-if="oldData" class="mt-4">{{ oldData?.name }}</div>
                    <v-chip v-if="oldData?.status" :color="oldData?.status.color">
                        {{ oldData?.status.label }}
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
                            variant="underlined"
                            autofocus                            
                            label="Name"
                            v-model="data.name"
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
                            variant="underlined"                            
                            label="Username"
                            v-model="data.username"     
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
                            variant="underlined"                            
                            type="email"
                            label="Email address"
                            v-model="data.email" 
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
                            variant="underlined"
                            
                            label="Company"
                            :items="companies"
                            v-model="data.companies"
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
                            variant="underlined"                            
                            label="Roles"
                            :items="roles"
                            v-model="data.roles"
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
                <v-row dense no-gutters>
                    <v-col cols="12" md="4">
                        <v-list-subheader>Password</v-list-subheader>
                    </v-col>

                    <v-col cols="12" md="8">
                        <v-text-field            
                            variant="underlined"                               
                            label="Password"
                            v-model="data.password"     
                            :append-inner-icon="password_visible ? 'mdi-eye-off' : 'mdi-eye'"
                            :type="password_visible ? 'text' : 'password'"    
                            @click:append-inner="password_visible = !password_visible" 
                            :hint="computedHint"
                            hide-details="auto"
                            :error-messages="handleError('password')"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>

    import { ref, computed, onMounted } from 'vue'

    const roles = ref([])
    const companies = ref([])
    const password_visible = ref(false)
    const statuses = ref([])
    const errors = ref(null)
    const loading = ref(false)
    const data = ref({
            name: '',
            email: '',
            username: '',
            roles: [],
            companies: [],
            status: null,
            password: ''
    })

    const props = defineProps({
        dataId: {
            type: Number,
            default: null
        }
    })
    let oldData = null

    const links = [
        ['mdi-account', 'User Information'],
        ['mdi-domain', 'Companies'],
        ['mdi-view-column', 'Custom Fields']
    ]
    
    const emits = defineEmits(['success', 'error', 'close'])        

    const handleSubmit = async () => {
        if (data){
            let param = data.id ? `/${data.id}` : ''        
            loading.value = true        
            errors.value = null
            let submit = {
                ...data,
                roles: data.roles.map(item => {
                    return item.name
                }),
                companies: data.companies?.map(item => item.id),
                status_id: data.status?.id
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
        const check = Object.keys(data).every(item => {
            return (data[item] == oldData.value[item])
        })
        if (!check){
            alert("Save?")
        }
        else {
            emits('close')
        }
    }

    const computedTitle = computed(() => {
        if (data){
            if (!data.id){
                return "Add User"
            }
            else {
                return "Edit User"
            }
        }
    })

    onMounted(async () => {    
        
        if (props.dataId){
            const responseData = await $fetchApi(`/admin/users/${props.dataId}`)
            data.value = responseData
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
        oldData = data.value
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
        if (data.id){
            return 'Keep this empty if you do not want to change the password'
        }
        return ''
    })

</script>