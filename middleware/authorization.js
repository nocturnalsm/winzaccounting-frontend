import { permissions } from '~/store/permissions'

export default defineNuxtRouteMiddleware((to, from) => {   
    
    if (process.client){
        const { $currentUser } = useNuxtApp()               
        let meta = to.meta.permission 
        if (typeof meta === 'string'){
            meta = [meta]
        }  
        const permissions = $fetchApi("/users/check-permission", {
            params: {
                permissions: meta.join(",")
            }
        }).then(response => {
            
            if (!$currentUser.user.role.includes('Super Admin')) {                            
                let error = false            
                meta.every(item => {
                    if (!response.includes(item)){
                        error = true
                        return false
                    }
                    return true
                })
                if (error){
                    return navigateTo({ 
                        name: "error", 
                        query: {
                            code: 422
                        }
                    })            
                }
            }
        })
    }
})