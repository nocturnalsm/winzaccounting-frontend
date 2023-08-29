<template>    
    <v-list open>
        <template v-for="menu in menus.items">
            <v-list-group v-if="menu.children" :value="menu.title" :class="menu.class">
                <template v-slot:activator="{ props }">
                    <v-list-item
                        v-bind="props"
                        :title="menu.title"
                        class="font-weight-bold"
                    >                    
                    </v-list-item>
                </template>
                <v-list-item                        
                    v-for="(item, index) in menu.children"
                    :key="index"                 
                    :value="item.title"
                    :to="item.route"       
                    :title="item.title"                     
                    :class="item.class"
                >                             
                </v-list-item>
            </v-list-group>
            <v-list-item                        
                v-else
                :to="menu.route"       
                :title="menu.title"    
                :class="menu.class"                 
            /> 
        </template>
    </v-list>
</template>

<script setup>
    import { menus } from '~/store/menus'
</script>