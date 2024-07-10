<template>
    <v-avatar
        color="brown"      
        :size="props.size"
        class="avatar"
    >
        <v-img v-if="props.image" :src="props.image"></v-img>
        <v-icon v-else-if="props.icon">{{ props.icon }}</v-icon>
        <span v-else class="text-h6">{{ props.label }}</span>
    </v-avatar>
</template>

<script setup>
    
    const props = defineProps({
        size: {
            default: 32,
            type: Number
        },
        label: {
            type: String,
            required: false
        },
        image: {
            type: String,
            required: false
        },
        icon: {
            type: String,
            required: false
        }
    })

</script>

<style scoped>
    .avatar :deep(.v-icon:before){
        font-size: xx-large;
    }
</style>