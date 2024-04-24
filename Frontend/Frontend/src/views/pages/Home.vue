<template>
  <div>
    <nav class="navbar navbar-primary custom-navbar2">      
      <router-link class="navbar-brand text-dark" to="/"></router-link>
      <div v-if="isLoggedIn">
        <router-link to="/profile" class="btn btn-success">
          Profile
        </router-link>
      </div>
      <div v-else>
        <router-link to="/login" class="btn btn-primary">
          Login
        </router-link>
        <router-link to="/signup" class="btn btn-primary">
          Sign Up
        </router-link>
      </div>
    </nav>
    <h1 class="text-dark text-center">Welcome to Chirrup!</h1>
    <div v-if="isLoggedIn">
      <newPost @new-post-added="loadFeed"/>
    </div>
    <em v-if="loading">Loading posts...</em>
    <ul v-if="posts.length">
      <li v-for="post in posts" :key="post.id">
        <div class="card border-success mb-3">
          <div class="card-body">
        <div>
          <p> 
            <router-link :to="'/users/' + post.author.user_id">
              {{ post.author.first_name + " " + post.author.last_name }} 
            </router-link>
            - {{ formatTimestamp(post.timestamp) }}
            <router-link :to="'/posts/' + post.post_id">
              {{ post.text }}
            </router-link>
          </p>
        </div>
          </div>
        </div>
      </li>
    </ul> 

    <div v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.custom-navbar2 {
  padding-top: 30px; 
  padding-bottom: 30px; 
  background-color: lightgreen; 
}
</style>
<script>
import { postService } from "../../services/posts.service"
import newPost from "../components/newPost.vue"

export default {
  components: {
    newPost
  },
  
  data() {
    return {
      posts: [],
      error: "",
      loading: true,
      newPostText: ""
    }
  },
  mounted() {
    
    postService.getFeed() 
    .then(posts => {
      this.posts = posts 
      this.loading = false
    })
    .catch(error => this.error = error);
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem("session_token") !== null;
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    },
    loadFeed() {
      postService.getFeed()
        .then(posts => {
          this.posts = posts;
          this.loading = false;
        })
        .catch(error => this.error = error);
    },

    
  }
}
</script>