<template>
    <v-avatar
        color="brown"      
        :size="props.size"        
    >
        <v-img v-if="user.google?.avatar" :src="user.google.avatar"></v-img>
        <span v-else class="text-h6">{{ user.avatar }}</span>
    </v-avatar>
</template>

<script setup>
    
    const { user } = useAuth()
    const props = defineProps({
        size: {
            default: 32,
            type: Number
        }
    })

</script>
