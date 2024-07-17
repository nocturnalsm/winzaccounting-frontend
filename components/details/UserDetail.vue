<template>
    <DetailPage           
        :data-id="dataId"                
        :disabled="props.loading"
        :avatar="computedAvatar"
        :status="data?.status"
        :name="data?.name"
        :links="links"
        :title="props.title"
        :loading="loading"
    >            
        <template #main>            
            <UserForm />
            <v-row>
                <v-col cols="12">
                    <v-btn @click="handleSubmit" color="primary">
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
    
    const computedHint = computed(() => {
        if (data.id){
            return 'Keep this empty if you do not want to change the password'
        }
        return ''
    })

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

</script>