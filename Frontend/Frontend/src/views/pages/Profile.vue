<template>
  <div>
      <returnHome/>
      <div class="card">
          <div class="card  border-success">
              <h1 class="card-title underline">Profile</h1>

              <em v-if="user.loading">Loading user...</em>

              <div v-else>
                  <p class="card-text"><span class="bold-text">First name:</span> {{ user.first_name }}</p>
                  <p class="card-text"><span class="bold-text">Last name:</span> {{ user.last_name }}</p>
                  <p class="card-text"><span class="bold-text">Username:</span> {{ user.username }}</p>
                  <p class="card-text"><span class="bold-text">Number of posts:</span> {{ user.posts ? user.posts.length : 0 }}</p>
                  <p class="card-text"><span class="bold-text">Number of followers:</span> {{ user.followers ? user.followers.length : 0 }}</p>
                  <p class="card-text"><span class="bold-text">Number of following:</span> {{ user.following ? user.following.length : 0 }}</p>
                  <button @click="logout" class="btn btn-primary">Logout</button>
              </div>
          </div>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>
  </div>
</template>
<style scoped>
.underline {
  text-decoration: underline;
}

.bold-text {
  font-weight: bold;
}
</style>
<script>

  import { userService } from "../../services/users.service.js";
  import { socialService } from "../../services/socials.service.js";
  import returnHome from "../components/returnHome.vue";
  
  export default {
    components: {
      returnHome
    },
    data() {
      return {
        user: {},
        error: "",
      };
    },
    mounted() {
      const userId = localStorage.getItem("user_id");
  
      if (userId) {
        socialService.getSingleUser(userId)
          .then((user) => {
            this.user = user;
          })
          .catch((error) => {
            this.error = error;
          });
      }
    },
    methods: {
      logout() {
        userService.logout(localStorage.getItem("session_token")) 
          .then((user) => {
            this.$router.push('/login'); 
          })
          .catch((error) => {
            this.error = error;
          });
      },
    },
  };
</script>