<template>
  <Dashboard>
    <Toast position="top-right" />
    <div class="form rounded-lg bg-white">
        <div class="bg-gray-300 py-4 px-8 rounded-t-lg">
            <h5 class="text-xl">Edit Role</h5>
        </div>
        <form @submit.prevent="submitForm">
            <div class="p-8">            
                <div class="grid gap-6 mb-4 md:grid-cols-2">
                    <div class="grow-2"> 
                        <label for="name" class="required block mb-2 text-md font-medium text-gray-900 dark:text-gray-300">Role name</label>
                        <input :disabled="loading" v-model="data.name" type="text" id="name" class="h-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Role name" required>
                        <div v-text="errors.name.join('<br />')" class="text-danger text-sm my-4" v-if="errors && errors.name" />
                    </div>
                </div>                
                <div class="mb-4">
                    <label for="name" class="required block mb-4 text-md font-medium text-gray-900 dark:text-gray-300">Permissions</label>
                    <div class="mb-4">
                        <div :key="`${item.type}-${index}`" :class="`permission-${item.type}`" v-for="(item, index) in permissions">
                            <label v-if="item.type == 'item'">
                                <input :checked="data.permissions.includes(item.name)" :disabled="loading" type="checkbox" @change="handleToggle($event, item.name)"/>
                                <span class="ml-2">{{ item.name }}</span>
                            </label>
                            <label v-if="item.type == 'header'">
                                {{ item.name }}
                            </label>
                        </div>
                    </div>
                </div>
                <Button class="mt-4 w-full lg:w-32" :disabled="loading" @click="submitForm" label="Save" />            
            </div>
        </form>
    </div>
  </Dashboard>
</template>

<style scoped>
    .permission-header {
        width: 100%;
        font-weight: bold;
        padding-top: 10px;
        padding-bottom: 10px;
        text-transform: capitalize;
    }
    .permission-item {
        width: 25%;
        display: inline-block;
        margin-bottom: 10px; 
    }
</style>
<script>
  export default {
      middleware: 'auth',
      data() {
          return {
              data: {
                name: '',
                permissions: []
              },
              permissions: [],
              errors: null,
              loading: false 
          }
      },
      methods: {
        async getPermissions () {
          this.loading = true
          const response = await this.$axios.$get('/api/permissions', {
            params: {
              limit: 100000000,
              sort: 'name'
            }
          })
          this.loading = false
          const permissionData = response.data.reduce((permissions, item, key) => {
            let last = permissions.length > 0 ? permissions[permissions.length - 1].name.split(".")[0] : ''
            if (item.name.indexOf(last + ".") == 0){
                permissions.push({
                    id: item.id,
                    name: item.name,
                    type: 'item'
                })
            }
            else {
                permissions.push({
                    name: item.name.split(".")[0].replace("_", " & "),
                    type: 'header'
                }, {
                   id: item.id,
                    name: item.name,
                    type: 'item' 
                })
            }
            return permissions
          }, [])
          this.permissions = permissionData
        },    
        async fetchData() {                    
            this.loading = true
            const response = await this.$axios.$get(`/api/roles/${this.$route.params.slug}`)            
            this.data.name = response.name
            this.data.permissions = response.permissions.map(i => i.name)
            this.loading = false
        },
        handleToggle (event, name) {

          let index = this.data.permissions.indexOf(name)
          if (index > -1){
              this.data.permissions.splice(index, 1)
          }
          else {
              this.data.permissions.push(name)
          }
        },    
        async submitForm() {
          this.loading = true
          try {
            const response = await this.$axios.$put(`/api/roles/${this.$route.params.slug}`, {
                    name: this.data.name,
                    permissions: this.data.permissions
                }
            )
            this.$toast.add({severity:'success', summary: 'Saved successfully', life: 3000});                                    
          }
          catch(err){
              this.errors = err.response ? err.response.data.errors : err 
              this.$toast.add({severity:'error', summary: 'Error on saving', life: 3000});
          }
          finally {
              this.loading = false
          }          
        }
      },
      mounted() {
          this.getPermissions()
          this.fetchData()
      }
  }
</script>