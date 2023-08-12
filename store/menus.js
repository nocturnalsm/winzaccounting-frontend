import { reactive, ref } from 'vue'

const items = ref([
    {
        title: 'Dashboard',
        icon: 'fa-solid fa-house',  
        route: { name: 'index' }          
    },
    {
        title: 'Notifications',
        icon: ['far', 'bell'],
        route: { name: 'notifications-id' }          
    },
    {
        title: 'Transactions',
        icon: ['far', 'handshake'],
        route: { name: 'transactions' }          
    },
    // {
    //     title: 'Leads',
    //     icon: 'fa-solid fa-bullseye',           
    // },    
    // {
    //     title: 'Support',
    //     icon: 'fa-solid fa-life-ring',            
    // },
    {
        title: 'Integrations',
        icon: 'fa-solid fa-microchip',   
        route: { name: 'integrations' }         
    },
    {
        title: 'Settings',
        icon: 'fa-solid fa-gear',    
        route: { name: "settings" }        
    },       
])

export const menus = reactive({
    items: [],
    async update () {               
        const {user} = useAuth()            
        const { data } = await $fetchApi("/categories", {
            params: {
                limit: 1000000,
                filter: {
                  hide_on_menu : true
                }
            }
        })
        this.items = [
            ...items.value.slice(0, 2),
            ...data.map(item => {
                return { 
                    title: item.title, 
                    route: { name: "items-category", params: { category: item.slug }}, 
                    icon: item.icon.split(" "),
                    url: item.url
                }
            })
        ]

        if(user.role.includes('Super Admin') || user.role.includes('Admin')) {
            this.items.push(...items.value.slice(2));    
        }
        else {            
            this.items.push(items.value[2]);    
        }
        
    }
})