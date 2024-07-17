<template>
    <div>
        <slot></slot>
    </div>
</template>

<script setup>
    const props = defineProps({
        errors: {
            type: Object,
            required: false
        }
    })
</setup>