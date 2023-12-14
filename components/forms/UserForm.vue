<template>
    <ModalForm 
        :title="computedTitle" 
        :visible="props.data != null"        
        :loading="props.loading"
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
                    autoFocus
                    density="compact"
                    label="Name"
                    v-model="props.data.name"
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
                ></v-text-field>
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
                    item-id="name"
                    multiple
                    chips
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
                    item-title="title"
                    item-value="id"
                    v-model="props.data.status"
                >
                    <template v-slot:item="{ props, item }">
                        <v-list-item
                            v-bind="props"
                            class="text-capitalize"
                            :title="props.title"
                        >
                        </v-list-item>
                    </template>
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
                    label="Input password to change password"
                    v-model="props.data.password"     
                    :append-inner-icon="password_visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="password_visible ? 'text' : 'password'"    
                    @click:append-inner="password_visible = !password_visible" 
                ></v-text-field>
            </v-col>
        </v-row>
    </ModalForm>
</template>

<script setup>

    import { ref, computed, onMounted } from 'vue'

    const roles = ref([])
    const password_visible = ref(false)
    const statuses = ref([])
    const props = defineProps({
        data: {
            type: Object,
            default: null
        },
        loading: {
            type: Boolean,
            default: false
        }
    })

    const emits = defineEmits(['submit', 'close'])

    const handleSubmit = () => {
        emits('submit', props.data)
    }

    const handleClose = () => {
        emits('close')
    }

    const computedTitle = computed(() => {
        if (!props.data.id){
            return "Add User"
        }
        else {
            return "Edit User"
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
                ...item,
                title: item.status.substring(0,1).toUpperCase() + item.status.substring(1)
            }
        })

        const responseRoles = await $fetchApi('/admin/roles', {
            params: {
                limit: -1,
                sort: 'name'
            }
        })
        roles.value = responseRoles
    })

</script>