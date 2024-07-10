<template>
    <UserForm />    
</template>

<script setup>

    import { ref, computed, onMounted } from 'vue'

    definePageMeta({
        middleware: 'auth',
        layout: 'admin'
    })

    const dataId = ref(null)

    onMounted(() => {
        dataId.value = useRoute().params.id
        console.log(dataId.value)
    })

</script>