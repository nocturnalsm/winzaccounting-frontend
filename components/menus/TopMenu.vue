<template>
    <div class="flex">       
        <template v-for="menu in menus.items"> 
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

                    <v-list v-if="menu.children">
                        <template :key="index" v-for="(item, index) in menu.children">
                            <v-list-item
                                :to="item.route"     
                                :class="item.class"                       
                            >                        
                                <v-list-item-title>{{ item.title }}</v-list-item-title>                            
                            </v-list-item>
                        </template>
                    </v-list>
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
    </div>
</template>

<script setup>
    import { menus } from '~/store/menus'
</script>