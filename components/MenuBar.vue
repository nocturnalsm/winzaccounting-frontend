<template>
    <div class="flex">       
        <template v-for="menu in menus"> 
            <v-menu open-on-hover>
                <template v-slot:activator="{ props }">
                    <v-btn
                        v-bind="props"
                    >
                        {{ menu.title }}
                    </v-btn>
                </template>

                <v-list v-if="menu.children">
                    <v-list-item
                        v-for="(item, index) in menu.children"
                        :key="index"
                    >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
    </div>
</template>

<script setup>
    const menus = [
        {
            title: 'Setup',
            children: [
                {
                    title: 'Accounts',                        
                },
                {
                    title: 'Customers'
                },
                {
                    title: 'Vendors'
                }
            ]
        },
        {
            title: 'Transactions',
            children: [
                {
                    title: 'Ledger',                        
                },
                {
                    title: 'Sales'
                },
                {
                    title: 'Purchase'
                }
            ]
        },
        {
            title: 'Journals',
            children: [
                {
                    title: 'Ledger',                        
                },
                {
                    title: 'Sales'
                },
                {
                    title: 'Purchase'
                }
            ]
        },
        {
            title: 'Reports',
            children: [
                {
                    title: 'Ledger',                        
                },
                {
                    title: 'Sales'
                },
                {
                    title: 'Purchase'
                }
            ]
        },
        {
            title: 'Settings',
            children: [
                {
                    title: 'Ledger',                        
                },
                {
                    title: 'Sales'
                },
                {
                    title: 'Purchase'
                }
            ]
        }                    
    ]
</script>