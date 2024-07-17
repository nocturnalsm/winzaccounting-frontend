<template>
    <UserDetail 
        title="Add User"
        @submit.info="handleSubmit"
    />    
</template>

<script setup>

    definePageMeta({
        middleware: 'auth',
        layout: 'admin'
    })
    
</script>