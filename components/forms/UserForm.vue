<template>
    <base-form v-bind="$attrs" ref="form">
        <v-row dense class="align-start">
            <v-col cols="12" md="8">
                <v-text-field
                    variant="underlined"
                    autofocus                            
                    label="Name"
                    v-model="props.data.name"
                    hide-details="auto"
                    :error-messages="form?.handleError('name')"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
                <v-text-field
                    variant="underlined"                            
                    label="Username"
                    v-model="props.data.username"     
                    hide-details="auto"
                    :error-messages="form?.handleError('username')"
                ></v-text-field>
            </v-col>
        </v-row>

        <v-row dense class="align-start">
            <v-col cols="12" md="6">
                <v-text-field
                    variant="underlined"                            
                    type="email"
                    label="Email address"
                    v-model="props.data.email" 
                    hide-details="auto"         
                    :error-messages="form?.handleError('email')"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">                
                <v-autocomplete
                    variant="underlined"                            
                    label="Status"
                    :items="statuses"
                    item-title="label"
                    item-value="id"
                    v-model="props.data.status" 
                    hide-details="auto"                 
                    :error-messages="form?.handleError('status_id')"  
                    return-object
                >
                </v-autocomplete>
            </v-col>
        </v-row>
        <v-row dense no-gutters class="align-start">
            <v-col cols="12">
                <v-text-field            
                    variant="underlined"                               
                    label="Password"
                    v-model="props.data.password"     
                    :append-inner-icon="password_visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="password_visible ? 'text' : 'password'"    
                    @click:append-inner="password_visible = !password_visible" 
                    :hint="computedHint"
                    hide-details="auto"
                    :error-messages="form?.handleError('password')"
                ></v-text-field>
            </v-col>
        </v-row>    
    </base-form>
</template>

<script setup>

    const form = ref(null)
    const props = defineProps({
        data: {
            type: Object            
        }
    })
    const password_visible = ref(false)
    const statuses = ref([])    

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
    })
    
    const computedHint = computed(() => {
        if (props.data.id){
            return 'Keep this empty if you do not want to change the password'
        }
        return ''
    })

</script>