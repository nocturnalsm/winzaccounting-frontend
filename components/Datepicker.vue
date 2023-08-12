<template>
    <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"          
          :disabled="readonly"
        >
        <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateFormatted"
              hide-details="auto"
              v-bind="$attrs" 
              v-on="on"
              outlined
              dense
              readonly
              :clearable="!readonly"
            />
        </template>
        <v-date-picker v-if="!time"
            v-model="selected"
            @input="menu1 = false"
            no-title            
        />
        <v-time-picker v-if="time" v-model="selected" />
    </v-menu>
</template>

<script>
    export default {
        props: {
            value: {                
                default: ''
            },
            time: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                menu1: null,
                date: null
            }
        },

        computed: {
            selected: {
                get() {                                 
                    return this.value
                },
                set(value) {
                    this.$emit('input', value)
                }
            },
            dateFormatted: {                
                get() {
                    if (!this.time){
                        return this.$dates.format(this.value)
                    }
                    return this.value
                },
                set(value) {
                    if (!value){
                        this.selected = value
                    }
                }
            }
        }        
    }
</script>