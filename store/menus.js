import { reactive, ref } from 'vue'

const items = ref([
    {
        title: 'Home',
        route: { name: 'index' }
    },
    {
        title: 'Setup',
        children: [
            {
                title: 'Accounts',
                route: { name: 'setup-accounts' }                        
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
                title: 'Companies',
                route: { name: 'settings-companies' }
            },
            {
                title: 'Permissions',
                route: { name: 'settings-permissions' }
            },                
            {
                title: 'Roles',
                route: { name: 'settings-roles' }
            },
            {
                title: 'Users',
                route: { name: 'settings-users' }
            }
        ]
    }                    
])

export const menus = reactive({
    items: items    
})