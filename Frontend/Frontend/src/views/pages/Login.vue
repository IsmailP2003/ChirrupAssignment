<template>
    <returnHome />
    <h1 class="font-weight-bold">Login</h1>

    <form @submit.prevent="handleSubmit">
        <label for="username">Username: </label>
        <input type="text" id="username" name="username" v-model="username" />
        <div v-if="submitted && !username">Username is required</div>

        <br/><br/>

        <label for="password">Password: </label>
        <input type="password" id="password" name="password" v-model="password"/>
        <div v-if="submitted && !password">Password is required</div>

        <br/><br/>

        <button class="btn btn-light btn-outline-primary">Login</button>
        <div v-if="error">{{error}}</div>

        <p> dont have an account?</p>
        <button class="btn btn-light btn-outline-primary">
            <router-link to="/signup">Sign Up</router-link>
        </button>
       
    </form>


</template>

<script>
    import { userService } from "../../services/users.service.js"
    import returnHome from "../components/returnHome.vue"

    export default {
        components: {
            returnHome
        },
        name: 'LogIn',
        data() {
            return {
                username: '',
                password: '',
                submitted: false,
                error:''
            }
        },
        methods: {
            handleSubmit(e) {
                this.submitted = true
                const { username, password } = this
                if(!(username && password)) { 
                    return; 
                }

                const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
                if(!password_pattern.test(password)) {
                    alert("Password must be at least 8 characters long, contain at least one number, one letter, and one special character")
                    return;
                }

                userService.login(username, password)
                .then(result => {
                    console.log("successful login");
                    this.$router.push('/');
                 })
                .catch(error => {
                    this.error = error;
                    this.submitted = false
                });
            }
        }
    }
</script>