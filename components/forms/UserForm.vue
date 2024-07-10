<template>
    <DetailPage           
        :data-id="dataId"                
        :disabled="props.loading"
        :avatar="computedAvatar"
        :status="data?.status"
        :name="data?.name"
        :links="links"
        :title="props.title"
    >            
        <template #main>            
            <v-row dense class="align-center">                
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
                <v-col cols="12" md="4">
                    <v-text-field
                        variant="underlined"                            
                        label="Username"
                        v-model="data.username"     
                        hide-details="auto"
                        :error-messages="handleError('username')"
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row dense class="align-center">
                <v-col cols="12" md="6">
                    <v-text-field
                        variant="underlined"                            
                        type="email"
                        label="Email address"
                        v-model="data.email" 
                        hide-details="auto"         
                        :error-messages="handleError('email')"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
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

            <v-row dense class="align-center">
                <v-col cols="12" md="6">
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
                <v-col cols="12" md="6">
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
            <v-row dense no-gutters class="align-center">
                <v-col cols="12">
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
            <v-row>
                <v-col cols="12">
                    <v-btn @click="handleClose" color="primary">
                        <v-icon icon="mdi-check"></v-icon>
                        <span class="d-inline ms-1">Save</span>
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </DetailPage>
</template>

<script setup>

    import { ref, computed, onMounted } from 'vue'
    
    const props = defineProps({
        dataId: {
            type: [String, Number],
            required: false
        },
        title: {
            type: String,
            required: false
        }
    })

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
            password: '',
            avatar: ''
    })
    
    const oldData = ref(null)

    const links = [
        ['mdi-account', 'User Information'],
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

    const computedAvatar = computed(() => {
        let value = { icon: "mdi-account" }
        if (data.value.avatar){
            if (data.value.avatar.startsWith('http')){
                value = {
                    image: data.avatar
                }
            }
            else if (data.value.avatar.startsWith('mdi-')){
                value = {
                    icon: data.avatar
                }
            }
            else {
                value = { label: data.value.avatar }
            }
        }
        return value
    })
    
    watch(() => props.dataId, async value => {
        if (props.dataId){
            const responseData = await $fetchApi(`/admin/users/${props.dataId}`)
            data.value = responseData
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
        oldData.value = { ...data.value }
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