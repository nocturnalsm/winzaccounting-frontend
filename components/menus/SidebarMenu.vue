<template>    
    <v-list open>
        <template v-for="menu in computedMenus">
            <template v-if="menu.visible">
                <v-list-group v-if="menu.children" :value="menu.title" :class="menu.class">
                    <template v-slot:activator="{ props }">
                        <v-list-item
                            v-bind="props"
                            :title="menu.title"
                            class="font-weight-bold"
                        >                    
                        </v-list-item>
                    </template>
                    <template :key="index" v-for="(item, index) in menu.children">
                        <v-list-item                                                              
                            :value="item.title"
                            :to="item.route"       
                            :title="item.title"                     
                            :class="item.class"
                            v-if="item.visible"
                        >                             
                        </v-list-item>
                    </template>
                </v-list-group>
                <v-list-item                        
                    v-else
                    :to="menu.route"       
                    :title="menu.title"    
                    :class="menu.class"                 
                /> 
            </template>
        </template>
    </v-list>
</template>

<script setup>
    import { menus } from '~/store/menus'
    const { user } = useAuth()
    const checkPermission = permission => {
        return user.permissions.includes(permission) ?? true
    }
    const computedMenus = computed(() => {
        function getMenus(arr) {
            
            const menu = arr.map(item => {                          
                let visible = true
                let newItem = item
                if (item.permission){
                    visible = checkPermission(item.permission)
                }
                newItem.visible = visible && (item.visible ?? true)

                if (item.children && item.children.length > 0) {
                    newItem.children = getMenus(item.children)
                }                
                return { ...newItem }
            })

            return { ...menu }
        }

        return getMenus(menus.items)
        
    })
</script>