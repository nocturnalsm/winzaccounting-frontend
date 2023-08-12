<template>
    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <p v-if="loading">
                Verifying email ....
            </p>
            <div v-if="!loading" class="w-full text-center bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-8 dark:bg-gray-800 dark:border-gray-700">
                <p class="p-2">Thank you for verifying your email.</p>                
                <p class="p-2">Continue to <NuxtLink to="/">Home</NuxtLink></p>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                loading: true
            }
        },
        async mounted() {
            let verify_url = this.$route.query.verify_url
            const response = await this.$axios.$get(verify_url)
            this.loading = false
        }
    }
</script>