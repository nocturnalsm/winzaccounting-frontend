<template>
  <v-row justify="center">
    <v-dialog
      v-model="props.visible"
      persistent
      :width="props.width"
    >     
    <form @submit.prevent="handleSubmit"> 
      <v-card :loading="props.loading">
        <v-toolbar
          dark
          color="primary"
        >          
          <v-toolbar-title>{{ props.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            icon
            dark
            @click="handleClose"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <slot></slot>            
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>          
          <v-btn
            variant="flat"
            dark
            color="primary"
            type="submit"     
            class="px-4"                   
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
      </form>
    </v-dialog>
  </v-row>
</template>

<script setup>

    const props = defineProps({
        title: {
            type: String,
            default: ''
        },
        width: {
            type: Number,
            default: 800
        },
        loading: {
            type: Boolean,
            default: false
        },
        visible: {
            type: Boolean,
            default: false
        }
    })

    const emits = defineEmits(['submit', 'close'])

    const handleSubmit = () => {
        try {
            emits('submit')
            emits('close')
        }
        catch (err){
            console.log(err)
        }
    }

    const handleClose = () => {
        emits('close')
    }

</script>