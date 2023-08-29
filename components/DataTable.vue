<template>
    <v-data-table-server        
        :headers="fields"
        :items="data"
        :items-length="totalData"
        :loading="loading"
        class="elevation-1"
        :footer-props="footerProps"
        :items-per-page="10"
        v-bind="$attrs"       
        :hide-default-footer="noFooter"
        :show-select="selectable"
        @update:options="handleData"
        item-value="id"
        v-model="selected"
        :search="search"
    >
        <template v-slot:top>
            <v-toolbar
                flat
                v-if="!noHeader"
            >
                <div class="d-flex align-center flex-grow-1">
                    <h1 class="text-h6 pl-4 pr-4 pr-sm-8">{{ title }}</h1>                    
                    <v-text-field                                      
                        prepend-inner-icon="mdi-magnify" 
                        placeholder="Search" 
                        variant="underlined"
                        :loading="loading"
                        single-line
                    />                
                </div>
                <v-spacer class="d-none d-sm-inline"></v-spacer>
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
                <div class="actions d-flex mx-sm-2">
                    <template v-for="(action, button) in toolbarButtons">
                        <v-btn                 
                            density="compact"                                                           
                            v-if="action.show"                         
                            :disabled="!action.enabled"                         
                            :key="button"
                            :color="action.color" 
                            :title="action.hover"
                            @click="action.click"
                            :class="`order-${action.order}`"
                        > 
                            <v-icon>{{ action.icon }}</v-icon>
                            <span class="ml-1 d-none d-md-inline">{{ action.title }}</span>
                        </v-btn>
                    </template>
                </div>
            </v-toolbar>
            <v-card flat class="px-4 pb-2">
                <slot name="filters" />
            </v-card>
        </template>
        <template v-slot:item.actions="{ item }">            
            <template v-if="showActionColumn">
                <div class="d-flex">
                    <template v-for="(action, index) in computedActionButtons">
                        <v-icon                        
                            small                            
                            :class="`mr-1 order-${action.order}`"
                            v-if="handleAction(action.show, item.raw)"                                                                            
                            @click="event => action.click(item.raw)"
                            :title="action.title"
                            :color="action.color"
                            :disabled="!handleAction(action.enabled, item.raw)"
                        >
                            {{ action.icon }}
                        </v-icon>
                    </template>
                    <slot name="actionButtons" :item="item.raw"></slot>
                </div>
            </template>            
        </template>        
        <template v-for="(_, name) in $slots" #[name]="{ item }">
            <slot :name="name" :item="item.raw" />
        </template>
    </v-data-table-server>
</template>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    const props = defineProps({
        headers: {
            type: [Array, Boolean],
            default: []
        },
        data: {
            type: Array,
            required: true
        },
        selectable: {
            type: Boolean,
            default: true
        },
        totalData: {
            type: Number,
            required: false
        },
        title: String,
        showActionColumn: {
            type: Boolean,
            default: true
        },
        dataFilter: {
            type: Object,
            default: null
        },
        noHeader: {
            type: Boolean,
            default: false
        },
        noFooter: {
            type: Boolean,
            default: false
        },
        confirmDelete: {
            type: Boolean,
            default: true
        },
        actionButtons: {
            type: Object,
            required: false
        },
        search: {
            type: String,
            default: ''
        }
    })
    const emit = defineEmits(['editClick', 'deleteClick', 'getData'])
    const editedItem = ref({})
    const editedIndex = ref(-1)
    const dialogDelete = ref(false)
    const loading = ref(false)
    const selected = ref([])
    const deleteItem = (item) => {            
        if (props.confirmDelete){
            editedIndex.value = props.data.indexOf(item)
            editedItem.value = Object.assign({}, item)
            dialogDelete.value = true
        }
        else {
            emit('deleteClick', editedItem.value)
        }
    }

    const toolbarButtons = {
        addButton: {
            name: 'add',
            title: 'Add New',
            icon: 'mdi-plus',
            hover: 'Add New',
            enabled: true,
            show: true,
            click: () => {
                emit('addClick')
            },
            color: 'primary',
            order: 0            
        },
        deleteSelectedButton: {
            name: 'deleteSelected',
            title: 'Delete',
            icon: 'mdi-trash-can',
            hover: 'Delete selected',
            enabled: true,
            show: false,
            click: () => {
                emit('deleteSelectedClick')
            },
            color: 'error',
            order: 1            
        }
    }

    const actionButtons = {
        editButton: {            
            title: 'Edit',
            icon: 'mdi-pencil',
            enabled: true,
            show: true,
            click: item => {
                editItem(item)
            },
            color: 'primary',
            order: 0            
        },
        deleteButton: {            
            title: 'Delete',
            icon: 'mdi-trash-can',            
            enabled: true,
            show: true,
            click: item => {
                deleteItem(item)
            },
            color: 'error',
            order: 1            
        }
    }
    
    const deleteItemConfirm = () => {
        emit('deleteClick', editedItem.value)
        closeDelete()
    }

    const closeDelete = () => {
        dialogDelete.value = false
        nextTick(() => {
            editedItem.value = Object.assign({}, {})
            editedIndex.value = -1
        })
    }
        
    const editItem = (item) => {
        emit('editClick', item)
    }
    
    const fields = computed(() => {            
        let headers = props.headers                        
        if (props.showActionColumn !== false){
            headers = [...headers, { title: 'Actions', key: 'actions', sortable: false }]
        }        
        return headers
    })
        
    const footerProps = computed(() => {            
        let footer = {
            showCurrentPage: true,
            showFirstLastPage: true
        }
        return footer
    })   
    
    const handleData = options => { 
        const { itemsPerPage, page, sortBy } = options       
        let params = {
            page: page,
            limit: itemsPerPage ?? 10,
            sort: sortBy[0] ? sortBy[0]['key'] : null,
            order: sortBy[0] ? sortBy[0]['order'] : 'asc'
        }                
        emit('getData', params)
    }
    
    watch (dialogDelete, val => {
        val || closeDelete()        
    })

    watch(selected, value => {
        toolbarButtons.deleteSelectedButton.show = value.length
    })
    
    const handleAction = (prop, item) => {
        if (typeof prop == 'function'){
            return prop(item)
        }
        else {
            return prop
        }
    }

    const computedActionButtons = computed(() => {
        let buttons = actionButtons        
        if (props.actionButtons){
            const { editButton, deleteButton } = props.actionButtons
            buttons = { 
                editButton: { ...actionButtons.editButton, ...editButton },
                deleteButton: { ...actionButtons.deleteButton, ...deleteButton },
            }
        }
        return buttons
    })

</script>