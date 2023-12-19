<template> 
    <div v-if="activeCompany.company" class="d-flex align-center text-caption">
        Company: <span class="text-body-2 text-decoration-underline">{{ activeCompany.company.name }}</span>
        <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
                <v-btn
                    v-bind="props"    
                    variant="text"       
                    size="small"
                    class="text-caption ml-2"
                >
                    Change
                </v-btn>
            </template>

            <v-list v-if="companies">
                <template :key="index" v-for="(item, index) in computedData">
                    <v-list-item href="company" @click.prevent="event => selectCompany(item.id)">
                        <v-list-item-title>{{ item.name }}</v-list-item-title>                            
                    </v-list-item>
                </template>
            </v-list>
        </v-menu>
    </div>
</template>

<script setup>
    
    import { activeCompany } from '~/store/activeCompany'
    import { ref, computed } from 'vue'
    
    const companies = ref(null)
        
    const response = await $fetchApi('/admin/companies', {
        params: {
            limit: -1,
            sort: 'name'
        }
    })
    
    companies.value = response
    
    const selectCompany = item => {
        const find = companies.value.find(itm => item == itm.id)
        
        activeCompany.set(find)
        
        if (process.client){
            window.localStorage.setItem('company', JSON.stringify(find))
            nextTick(() => {
                window.location.reload()
            })
        }
    }

    const computedData = computed(() => {        
        return companies.value.filter(item => item.id != activeCompany?.company.id)
    })
</script>