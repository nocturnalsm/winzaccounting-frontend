// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({  
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    server: {
      hmr: {
        protocol: 'ws'
      }
    }
  },
  runtimeConfig: {
    public: {    
      baseUrl: process.env.API_URL,
      apiUrl: `${process.env.API_URL}/api/${process.env.API_VERSION}`,
      appTitle: 'Winz Accounting'      
    }        
  },
  modules: [  
    'nuxt-sanctum-auth',
    '@pinia/nuxt',            
  ],
  routeRules: {
    '/auth/**': { ssr: false },
    '/admin/**': { ssr: false }
  },
  nuxtSanctumAuth: {
      token: false, // set true to use jwt-token auth instead of cookie. default is false
      baseUrl: process.env.API_URL,
      endpoints: {
        csrf: '/sanctum/csrf-cookie',
        login: '/login',
        logout: '/logout',
        user: `/api/${process.env.API_VERSION}/user`
      },
      redirects: {
        home: '/',
        login: '/auth/login',
        logout: '/auth/login'
      }
  },
})
