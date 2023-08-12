import { reactive } from 'vue'

export const permissions = reactive({
    items: [],
    async update () {
        try {            
            this.items = await $fetchApi("/users/check-permission")
        }
        catch (e){
            this.items = []
            console.log(e)
        }        
    }
})