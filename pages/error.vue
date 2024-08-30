<template>
    <section class="min-h-screen bg-white">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div class="mx-auto max-w-screen-sm text-center">
                <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">{{ error.statusCode }}</h1>
                <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">{{ error.statusMessage }}</p>                
                <NuxtLink to="/" class="inline-flex text-a11y bg-primary underline hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center  my-4">Back to Homepage</NuxtLink>
            </div>   
        </div>
    </section>
</template>

<script setup>

    import { computed } from 'vue'

    const errors = {
        422: 'Unauthorized',
        404: 'Not Found'
    }
        
    const error = computed(() => {
        const route = useRoute()
        let code = route.query.code ?? '404'
        return {
            statusCode: code,
            statusMessage: errors[code]
        }
    })

    useHead({
        title: 'Error'
    })

</script>