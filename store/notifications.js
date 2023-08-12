import { reactive } from 'vue'

export const notifications = reactive({
    items: [],
    unread: 0,
    async update () {            
        const response = await $fetchApi("/notifications/preview")
        this.items = response.data
        this.unread = response.unread
    }
})