<template>
    <div     
        :loading="props.loading"
        class="rounded-lg text-body-1 bg-white mt-16"
        :disabled="props.loading"
    >                    
        <v-row class="mt-0">        
            <v-col cols="12" md="3" class="position-fixed pt-0 pb-0">
                <slot name="sidepane">
                <v-sheet
                    class="pa-4 text-center d-flex d-md-block"
                    color="grey-lighten-4"                    
                >
                    <Avatar v-if="props.avatar" v-bind="props.avatar" :size="80" />
                    <div class="ml-4 ml-md-0 mt-2 text-left text-md-center">
                        <div v-if="props.name">{{ props.name }}</div>
                        <div v-if="props.status" class="d-block mt-2 pa-0">
                            <v-chip :color="props.status.color">
                                {{ props.status.label }}
                            </v-chip>
                        </div>
                    </div>
                </v-sheet>

                <v-divider></v-divider>

                <v-list class="d-flex justify-center justify-md-start d-md-block">                
                    <v-list-item              
                        v-for="link in props.links"
                        :key="link.icon"                        
                        @click="ev => scrollTo(link.ref)"
                        link
                        class="m-md-auto"                        
                        :title.attr="link.text"
                    >
                        <v-icon>{{ link.icon }}</v-icon>
                        <span class="d-none d-md-inline ml-4">
                            {{ link.text }}
                        </span>
                    </v-list-item>
                </v-list>
                </slot>
            </v-col>
            <v-col cols="12" offset-md="3" md="9" class="px-8 pl-md-4 pr-md-8 pt-0 pt-md-4 pb-10 mt-16">                    
                <v-breadcrumbs :items="breadcrumbs" class="px-0 mx-0 mt-16">
                    <template v-slot:prepend>
                        <v-icon icon="mdi-home" class="mr-2"></v-icon>
                    </template>
                </v-breadcrumbs>
                <slot name="main"></slot>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>

    import { ref, computed, onMounted } from 'vue'
    import { useDisplay } from 'vuetify'

    const { mdAndUp } = useDisplay()
    const props = defineProps({
        dataId: {
            type: [String, Number],
            required: false
        },
        title: {
            type: String,
            required: false
        },
        links: {
            type: [Array, Function],
            required: false
        },
        name: {
            type: String,
            required: false
        },
        status: { 
            type: [Object, Function],
            required: false
        },
        avatar: {
            type: Object,
            required: false
        },
        breadcrumbs: {
            type: [Array, Function],
            required: false
        }
    })

    const errors = ref(null)      
    
    const handleClose = () => {
        useRouter().back()
    }
    
    const handleError = field => {
        if (errors.value){
            let isError = errors.value.hasOwnProperty(field)
            if (isError){
                return errors.value[field]
            }
        }
        return ''
    }

    const scrollTo = ref => {        
        if (ref){
            document.getElementById(ref).scrollIntoView({ behavior: 'smooth' });
        }
    }

</script>