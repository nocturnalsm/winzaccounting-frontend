<template>
    <div class="flex">       
        <template v-for="menu in computedMenus"> 
            <template v-if="menu.visible">
                <template v-if="menu.children">
                    <v-menu open-on-hover>
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                :class="menu.class"
                            >
                                {{ menu.title }}
                            </v-btn>
                        </template>
                        <v-card>
                            <template v-for="(item, index) in menu.children">
                                <v-list-item                                                              
                                    :value="item.title"
                                    :to="item.route"       
                                    :key="index"
                                    :title="item.title" 
                                    v-if="item.visible"
                                    :class="`topmenu menu-item ${item.class}`"
                                >                             
                                </v-list-item>
                            </template>
                        </v-card>
                    </v-menu>
                </template>
                <NuxtLink                
                    type="button"
                    v-else                
                    :class="menu.class"
                    :to="menu.route"
                >
                    <v-btn>{{ menu.title }}</v-btn>
                </NuxtLink>
            </template>
        </template>
    </div>
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

<style scoped>
    
</style>