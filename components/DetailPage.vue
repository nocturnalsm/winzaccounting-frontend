<template>
  <v-card     
      :loading="props.loading"
      class="rounded-lg text-body-1"
      :disabled="props.loading"
  >            
    <v-toolbar dense>  
        <slot name="toolbar">                       
            <v-toolbar-title>{{ computedTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>           
            <v-btn @click="handleClose" class="ms-5" icon="mdi-close"></v-btn>                    
        </slot>
    </v-toolbar>
    <v-row class="mt-0">        
        <v-col cols="12" md="3">
            <slot name="sidepane">
              <v-sheet
                  class="pa-4 text-center"
                  color="grey-lighten-4"                    
              >
                  <Avatar v-if="props.avatar" v-bind="props.avatar" :size="80" />

                    <div v-if="props.name" class="mt-4">{{ props.name }}</div>
                    <div v-if="props.status" class="d-block mt-2">
                        <v-chip :color="props.status.color">
                            {{ props.status.label }}
                        </v-chip>
                    </div>
              </v-sheet>

              <v-divider></v-divider>

              <v-list>
                  <v-list-item                    
                  v-for="[icon, text] in props.links"
                      :key="icon"
                      :prepend-icon="icon"
                      :title="text"
                      link
                  ></v-list-item>
              </v-list>
            </slot>
          </v-col>
          <v-col cols="12" md="9" class="pa-8 pb-10 pe-8">    
            <slot name="main"></slot>
          </v-col>
      </v-row>
  </v-card>
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
            type: String,
            required: false
        }
    })

    const errors = ref(null)      
    
    const handleClose = () => {
        useRouter().back()
    }
    
    const computedTitle = computed(() => {
        if (props.title){
            return props.title
        }
        else {            
            if (props.dataId){
                return "Edit Data"
            }
            else {
                return "Add New"
            }
        }
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

</script>