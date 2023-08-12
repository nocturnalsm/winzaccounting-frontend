<template>
  <Dashboard>
    <ConfirmDialog />
    <Toast />
    <DataTable 
        :lazy="true"
        :totalRecords="totalRecords"
        :loading="loading" 
        @page="onPage($event)" 
        @sort="onSort($event)"
        responsiveLayout="scroll"
        class="font-roboto text-sm rounded-md"
        stripedRows
        :value="roles"
        dataKey="id" 
        :paginator="true" 
        :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
        :rowsPerPageOptions="[5,10,25]"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
    >
        <template #header>
            <div class="table-header flex flex-column md:flex-row md:justify-content-between">
                <h5 class="mb-2 md:m-0 p-as-md-center text-lg">Manage Roles</h5>
            </div>
        </template>
        <Column :sortable="true" field="name" header="Name"></Column>
        <Column field="permissions" header="Permissions">
            <template #body="slotProps">
                <Tag class="mr-2" v-for="perm in slotProps.data.permissions" :key="perm.id">
                    {{ perm.name }}
                </Tag>
            </template>
        </Column>
        <Column field="id" header="Action">
            <template #body="slotProps">
                <div class="flex justify-start">
                    <NuxtLink v-if="canEdit" :to="{name: 'roles-slug', params: {slug: slotProps.data.id}}">
                        <Button icon="fa fa-edit" class="p-button-rounded p-button-text p-button-primary" />
                    </NuxtLink>                    
                    <Button v-if="canDelete" @click="handleDelete($event, slotProps.data.id)" icon="fa fa-trash" class="p-button-rounded p-button-text p-button-danger" />
                </div>
            </template>
        </Column>        
    </DataTable>
  </Dashboard>
</template>

<script>
    export default {
        middleware: 'auth',
        data() {
            return {
                roles: null,
                loading: false,
                totalRecords: 0,
                lazyParams: {
                    page: 1,
                    sort: null,
                    order: null,
                    limit: 10
                }
            }
        },
        methods: {
            async fetchData() {
                this.loading = true
                const response = await this.$axios.$get('/api/roles', {params: this.lazyParams})          
                this.roles = response.data
                this.totalRecords = response.total
                this.loading = false       
            },
            onPage(event) {
                this.lazyParams = {...this.lazyParams, page: event.page + 1}
                this.fetchData();
            },
            onRowPerPage(event) {
                console.log(event)
            },
            onSort(event) {
                let sortField = event.sortField
                let order = event.sortOrder === -1 ? 'desc' : (event.sortOrder === 1 ? 'asc' : null)
                this.lazyParams = {...this.lazyParams, sort: sortField, order: order}
                this.fetchData();
            },
            handleDelete(event, id){
                this.$confirm.require({
                    message: 'Are you sure you want to proceed?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    accept: async () => {
                        this.loading = true
                        try {
                            await this.$axios.$delete(`/api/roles/${idToDelete}`)
                            this.fetchData()
                            this.$toast.add({severity:'success', summary: 'Record successfully deleted', life: 3000})
                        }
                        catch (err){
                            this.$toast.add({severity:'error', summary: err, life: 3000});
                        }
                        finally {
                            this.loading = false
                        }                    
                    }
                })
            }
        },        
        mounted() {
            this.lazyParams = {
                first: 0,
                rows: 10,
                sortField: null,
                sortOrder: null
            };

            this.fetchData()
        },
        computed: {
            canEdit() {
                return this.$auth.user.data.permissions.includes('roles.edit')
            },
            canDelete(){
                return this.$auth.user.data.permissions.includes('roles.delete')
            }
        }              
    }
</script>

<style lang="scss" scoped>
    .table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        @media screen and (max-width: 960px) {
            align-items: start;
        }
    }
    
    @media screen and (max-width: 960px) {
        ::deep(.p-toolbar) {
            flex-wrap: wrap;
            
            .p-button {
                margin-bottom: 0.25rem;
            }
        }
    }
</style>
