<template>
  <v-row justify="center">
    <v-dialog
      v-model="props.visible"
      persistent
      :width="props.width"
      v-bind="$attrs"
    >     
    <form @submit.prevent="handleSubmit"> 
      <fieldset :disabled="props.loading">
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
          <v-container class="pb-0">
            <slot></slot>            
          </v-container>
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
      </fieldset>
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

    const handleSubmit = async () => {
        try {
            emits('submit')
        }
        catch (err){
            console.log(err)
        }
    }

    const handleClose = () => {
        emits('close')
    }

</script>