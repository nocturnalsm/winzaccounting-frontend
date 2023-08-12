<template>
    <v-data-table        
        :headers="fields"
        :items="data"
        :options.sync="options"
        :server-items-length="syncDataServer"
        :loading="loading"
        class="elevation-1"
        :footer-props="footerProps"
        :items-per-page="-1"
        v-bind="$attrs"       
        :hide-default-footer="noFooter"
    >
        <template v-slot:top>
            <v-toolbar
                flat
                v-if="!noHeader"
            >
                <v-toolbar-title>{{ title }}</v-toolbar-title>                      
                <v-spacer></v-spacer>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h6">Apakah Anda yakin akan menghapus data?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="red darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>                
                <slot name="actions" />                
            </v-toolbar>
            <v-card flat class="px-4 pb-2">
                <slot name="filters" />
            </v-card>
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon
                v-if="actionField && actionField.edit"
                small
                class="mr-2"
                @click="editItem(item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                v-if="actionField && actionField.delete"
                small
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
        </template>
        <template v-for="(_, name) in $scopedSlots" #[name]="{ item }">
            <slot :name="name" :item="item" />
        </template>
    </v-data-table>
</template>

<script>
  export default {      
    props: {
        headers: {
            type: [Array, Boolean]
        },
        data: {
            type: Array,
            required: true
        },
        totalData: {
            type: Number,
            required: false
        },
        title: String,
        actionField: {
            type: [Object, Boolean],
            default() {
                return { edit: true, delete: true }
            }
        },
        dataFilter: {
            type: Object,
            default: null
        },
        syncData: {
            type: Boolean,
            default: true
        },
        noHeader: {
            type: Boolean,
            default: false
        },
        noFooter: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            editedItem: {},
            editedIndex: -1,
            dialogDelete: false,
            loading: false,
            options: {}            
        }
    },
    methods: {
        deleteItem (item) {            
            this.editedIndex = this.$props.data.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },
        deleteItemConfirm () {
            this.$emit('onDeleteClick', this.editedItem)
            this.closeDelete()
        },
        closeDelete () {
            this.dialogDelete = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, {})
                this.editedIndex = -1
            })
        },
        editItem (item) {
            this.$emit('onEditClick', item)
        }
    },  
    computed: {
        fields() {            
            let headers = this.$props.headers                        
            if (this.$props.actionField !== false){
                headers = [...headers, { text: 'Actions', value: 'actions', sortable: false }]
            }
            return headers
        },                
        syncDataServer() {
            return this.syncData ? this.totalData: -1
        },
        footerProps() {            
            let props = {
                showCurrentPage: true,
                showFirstLastPage: true
            }
            let rowsPerPage = this.$attrs['rows-per-page'] ?? 10
            if (rowsPerPage >= 0) {                
                props = { ...props, itemsPerPageOptions: [10, 20, 50] }
            }
            else {
                props = { ...props, itemsPerPageOptions: [10, 20, 50, -1] }
            }
            return props
        }   
    },
    watch: {
        options: {
            handler () {
                let params = {
                    page: this.options.page,
                    limit: this.options.itemsPerPage,
                    sort: this.options.sortBy[0],
                    order: !this.options.sortBy || !this.options.sortDesc[0] ? 'asc' : 'desc',
                    filter: this.dataFilter ?? null
                }                
                this.$emit('onGetData', params)
            },
            deep: true,
        },
        dataFilter: {
            handler() {
                this.options = {...this.options, page: 1}
            },            
            deep: true
        },
        dialogDelete (val) {
            val || this.closeDelete()
        }
    },
  }
</script>