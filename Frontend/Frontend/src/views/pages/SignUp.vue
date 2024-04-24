<template>
        <returnHome />
        <div class="card">
            <div class="card-body">
                <h1 class="card-title">SignUp</h1>
                <form @submit.prevent="handleSubmit">
                    <label for="firstName">First name: </label>
                    <input type="text" id="firstName" name="firstName" v-model="firstName" autocomplete="given-name" />
                    <div v-if="submitted && !firstName">First name is required</div>
                    <div v-if="submitted && firstName.length < 3">First name must be at least 3 characters</div>

                    <br/><br/>

                    <label for="lastName">Last name: </label>
                    <input type="text" id="lastName" name="lastName" v-model="lastName" autocomplete="family-name" />
                    <div v-if="submitted && !lastName">Last name is required</div>
                    <div v-if="submitted && lastName.length < 3">Last name must be at least 3 characters</div>

                    <br/><br/>

                    <label for="username">Username: </label>
                    <input type="text" id="username" name="username" v-model="username" autocomplete="off"/>
                    <div v-if="submitted && !username">Username is required</div>
                    <div v-if="submitted && username.length < 3">Username must be at least 3 characters</div>

                    <br/><br/>

                    <label for="password">Password: </label>
                    <input type="password" id="password" name="password" v-model="password" autocomplete="off"/>
                    <div v-if="submitted && !password">Password is required</div>
        
        <br/><br/>

        <p>{{ username + " " + password }}</p>
        <button>Create account</button>
        <div v-if="error">{{error}}</div>
    </form>

    <p>Already have an account?</p>
    <button>
        <router-link to="/login">Login</router-link>
    </button>
</div>
        </div>
    
</template>

<script>

    import {userService} from "../../services/users.service.js"
    import returnHome from "../components/returnHome.vue"

    export default {
        components: {
            returnHome
        },
        name: 'LogIn',
        data() {
            return {
                firstName: '',
                lastName: '',
                username: '',
                password: '',
                submitted: false,
                error:""
            }
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true
                const { firstName, lastName, username, password } = this
                if(!(firstName && lastName && username && password)) { 
                    return; 
                }

                if (firstName.length < 3 || lastName.length < 3 || username.length < 3) {
                    return;
                }

                const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
                if(!password_pattern.test(password)) {
                    alert("Password must be at least 8 characters long, contain at least one number, one letter, and one special character")
                    return;
                }

                userService.createUser(firstName, lastName, username, password)
                .then(result => {
                    console.log("successfull")
                    this.$router.push('/login')
                    
                })
                .catch(error => {
                    this.error = error;
                    this.submitted = false
                });
            }
        }
    }
</script>
