<template>
    <v-row dense class="align-center">                
        <v-col cols="12" md="8">
            <v-text-field
                variant="underlined"
                autofocus                            
                label="Name"
                v-model="data.name"
                hide-details="auto"
                :error-messages="handleError('name')"
            ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
            <v-text-field
                variant="underlined"                            
                label="Username"
                v-model="data.username"     
                hide-details="auto"
                :error-messages="handleError('username')"
            ></v-text-field>
        </v-col>
    </v-row>

    <v-row dense class="align-center">
        <v-col cols="12" md="6">
            <v-text-field
                variant="underlined"                            
                type="email"
                label="Email address"
                v-model="data.email" 
                hide-details="auto"         
                :error-messages="handleError('email')"
            ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
            <v-autocomplete
                variant="underlined"
                
                label="Company"
                :items="companies"
                v-model="data.companies"
                item-title="name"
                item-value="id"
                multiple
                chips
                return-object
                hide-details="auto"
                :error-messages="handleError('companies')"
            ></v-autocomplete>
        </v-col>
    </v-row>

    <v-row dense class="align-center">
        <v-col cols="12" md="6">
            <v-autocomplete
                variant="underlined"                            
                label="Roles"
                :items="roles"
                v-model="data.roles"
                item-title="name"
                item-value="id"
                multiple
                return-object
                chips
                hide-details="auto"
            ></v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
            <v-autocomplete
                variant="underlined"                            
                label="Status"
                :items="statuses"
                item-title="label"
                item-value="id"
                v-model="data.status" 
                hide-details="auto"                 
                :error-messages="handleError('status_id')"  
                return-object
            >
            </v-autocomplete>
        </v-col>
    </v-row>
    <v-row dense no-gutters class="align-center">
        <v-col cols="12">
            <v-text-field            
                variant="underlined"                               
                label="Password"
                v-model="data.password"     
                :append-inner-icon="password_visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="password_visible ? 'text' : 'password'"    
                @click:append-inner="password_visible = !password_visible" 
                :hint="computedHint"
                hide-details="auto"
                :error-messages="handleError('password')"
            ></v-text-field>
        </v-col>
    </v-row>    
</template>