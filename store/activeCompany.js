import { reactive } from 'vue'

export const activeCompany = reactive({
    company: null,
    set(company){        
        this.company = company        
    }
})