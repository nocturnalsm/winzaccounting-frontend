<template>
    <DetailPage           
        :data-id="dataId"                
        :disabled="loading"
        :avatar="computedAvatar"
        :status="data?.status"
        :name="data?.name"
        :links="links"
        :title="props.title"
        :loading="loading"
    >            
        <template #main>      
            <div class="overflow-y-auto overflow-x-hidden h-screen pr-8">
                <h6 id="user-information" class="text-h6 mb-4">User Information</h6>
                <UserForm :loading="loading" :errors="errors" class="mb-4" :data="data" />
                <v-row class="mb-6">
                    <v-col cols="12">
                        <v-btn @click="handleSubmit" color="primary">
                            <v-icon icon="mdi-check"></v-icon>
                            <span class="d-inline ms-1">Save</span>
                        </v-btn>
                    </v-col>
                </v-row>            
                <h6 id="companies" class="text-h6 mb-4">Companies</h6>
                <v-row class="mb-6">                
                    <v-col cols="12">
                        <v-data-table-server        
                            :headers="companiesFields"
                            :items="data.companies"
                            :items-length="data.companies.length"
                            class="elevation-4 text-body-2"
                            :items-per-page="10"
                            hide-default-footer                        
                            item-value="id"       
                        />
                    </v-col>
                </v-row>
                <h6 id="roles" class="text-h6 mb-4">Roles</h6>
                <v-row>                
                    <v-col cols="12">
                        <v-data-table-server        
                            :headers="rolesFields"
                            :items="data.roles"
                            :items-length="data.roles.length"
                            class="elevation-4 text-body-2"
                            :items-per-page="10"
                            hide-default-footer                        
                            item-value="id"       
                        />
                    </v-col>
                </v-row>
            </div>
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
    
    const data = ref({
            name: '',
            email: '',
            username: '',
            status: null,
            password: '',
            avatar: '',
            companies: [],
            roles: []
    })
    
    const loading = ref(false)
    const errors = ref(null)
    const links = [
        {
            icon: 'mdi-account', 
            text: 'User Information', 
            ref: 'user-information'
        },
        {
            icon: 'mdi-view-column', 
            text: 'Companies', 
            ref: 'companies'
        },
        {
            icon: 'mdi-account-group', 
            text: 'Roles', 
            ref: 'roles'
        }
    ]
    
    const emits = defineEmits(['success', 'error', 'close'])        

    const computedAvatar = computed(() => {
        let value = { icon: "mdi-account" }
        if (data.value?.avatar){
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
            Object.keys(data.value).forEach(o => {
                data.value[o] = responseData[o] ?? null
            })            
        }
    })

    const handleSubmit = async () => {
        if (data.value){
            let param = props.dataId ? `/${props.dataId}` : ''        
            loading.value = true        
            errors.value = null
            let submit = {
                ...data.value,
                status_id: data.value.status?.id
            }
            try {
                const response = await $fetchApi(`/admin/users${param}`, {
                    method: props.dataId ? 'PUT' : 'POST',
                    body: submit
                })
                $toast({
                    message: "Data saved successfully",
                    state: 'success'                    
                })
                if (!props.dataId){
                    setTimeout(() => {
                        useRouter().push({ name: 'settings-users-id', params: { id: response.id }})
                    }, 1500)
                }
            }
            catch (err){       
                errors.value = err.response ? err.response._data.errors : {}
                $toast({
                    message: "Error on saving",
                    state: 'error'
                })
            }
            finally {
                loading.value = false
            }
        }
    }

    const companiesFields = [
        {
            title: 'Name',
            key: 'name'
        },
        {
            title: 'Role',
            key: 'role'
        }
    ]

    const rolesFields = [
        {
            title: 'Role',
            key: 'name'
        },
        {
            title: 'Company',
            key: 'company'
        }
    ]
</script>