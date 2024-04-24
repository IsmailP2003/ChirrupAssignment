<template>
  <div>
    <returnHome/>

    <h1>Single User</h1>

    <em v-if="user.loading">Loading user...</em>
    <div v-else class="card">
      <div class="card-body">
        <h5 class="card-title">{{ user.first_name }} {{ user.last_name }}</h5>
        <p class="card-text">Username: {{ user.username }}</p>
        <p class="card-text">Number of followers: {{ user.followers.length }}</p>
        <p class="card-text">Number of following: {{ user.following.length }}</p>
        <p class="card-text">Posts: </p>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="post in user.posts" :key="post.id">
            <router-link :to="'/posts/' + post.post_id">
              {{ post.text }}
            </router-link>
          </li>
        </ul>
        <button v-if="user.user_id != loggedInUserId" class="btn btn-primary">Follow</button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
  </div>
</template>
  
  <script>
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
        loggedInUserId: localStorage.getItem("user_id"),
      };
    },
    created() {
      this.user.loading = true;
  
      socialService.getSingleUser(this.$route.params.id)
        .then((user) => {
          this.user = user;
        })
        .catch((error) => {
          this.error = error;
        });
    },
  };
  </script>