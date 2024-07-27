<template>
    <fieldset class="border-0" :disabled="loading">
        <slot></slot>
    </fieldset>
</template>

<script setup>

    const props = defineProps({
        errors: {
            type: Object,
            required: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    })
    
    const emits = defineEmits(['submit'])

    const handleError = field => {
        if (props.errors){
            let isError = props.errors.hasOwnProperty(field)
            if (isError){
                return props.errors[field]
            }
        }
        return ''
    }

    defineExpose({
        handleError
    })

</script>