export default defineNuxtRouteMiddleware(async (to, from) => {   
    
    const { user } = useAuth()               
    let meta = to.meta.permission 
    if (typeof meta === 'string'){
        meta = [meta]
    }  

    if (!user.role.includes('Super Admin')) {                            
        let error = true            
        meta.every(item => {
            if (user.permission.includes(item)){
                error = false
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