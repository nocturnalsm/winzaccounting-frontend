<template>
    <UserDetail 
        title="Add User"
    />    
</template>

<script setup>

    definePageMeta({
        middleware: 'auth',
        layout: 'admin'
    })
    
</script>