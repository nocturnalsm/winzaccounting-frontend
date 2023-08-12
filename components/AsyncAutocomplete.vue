<template>
    <v-autocomplete 
        hide-details="auto" 
        outlined 
        dense 
        @input="handleInput"
        @click:clear="$emit('input', null)"
        :item-text="displayField"
        :item-value="valueField"
        :items="items"
        :search-input.sync="search"
        :loading="loading"
        cache-items
        clearable
        return-object
        v-bind="[$props,$attrs]" 
        v-on="$listeners"
    />
</template>

<script>
    import _ from 'lodash'
    export default {
        props: ['value', 'loading', 'valueField', 'displayField'],
        data(){
            return {
                items: [],
                search: null,
                innerLoading: false,
                innerValue: this.value
            }
        },
        watch: {            
            search (val) {
                if (!val){
                    return
                }
                _.debounce(this.fetchData, 200)(val, this)
            }
        },
        methods: {
            handleInput (e) {
                this.$emit('input', e)
            },
            callbackGetData (items) {
                this.items = items
            },
            async fetchData (value, self) {
                if (!value) {
                    self.items = [];
                    self.innerValue = null;
                }
                if (self.loading) {
                    return
                }
                try {
                    this.$emit('onGetData', value, this.callbackGetData)
                }
                catch(error) {
                    console.log(error)
                }
            }
        }
    }
</script>