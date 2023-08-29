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
                route: { name: 'companies' }
            },
            {
                title: 'Users',
                route: { name: 'users' }
            },
            {
                title: 'Permissions',
                route: { name: 'permissions' }
            },                
            {
                title: 'Roles',
                route: { name: 'roles' }
            }
        ]
    }                    
])

export const menus = reactive({
    items: items    
})