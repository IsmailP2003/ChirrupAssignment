<template>
  <div>
      <returnHome/>
      <em v-if="post.loading"> loading post... </em>

      <div v-else class="card border-success">
          <div class="card-body">
              <p class="card-text"> 
                  Author: <router-link :to="'/users/' + post.author.user_id"> 
                      {{ post.author.first_name + " " + post.author.last_name }}
                  </router-link>
              </p>
              <p class="card-text">{{ post.text }}</p>
              <p class="card-text">Posted: {{ date(post.timestamp) }} at  {{ time(post.timestamp) }} </p>
              <p class="card-text">Number of likes: {{ post.likes.length }}</p>
          
              <br>
          
              <deletePost :postId="post.id" @post-deleted="handlePostDeleted" />
              <p class="card-text">{{ post }}</p>
          </div>
      </div>
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

  </div>
</template>
  
  <script>
  import { postService } from "../../services/posts.service"
  import returnHome from "../components/returnHome.vue"
  import deletePost from "../components/DeletePost.vue"
  export default {
    components: {
      returnHome,
      deletePost
    },
    data() {
      return {
        post: {},
        error: ""
      }
    },
    created() {
        this.post.loading = true;

        postService.getSinglePost(this.$route.params.id)
        .then(post => {
          this.post = post 
        })
        .catch(error => this.error = error);
    },
    methods: {
        date(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString(); 
        },
        time(timestamp) {
            const date = new Date(timestamp);
            const hours = date.getHours().toString().padStart(2, '0');  
            const minutes = date.getMinutes().toString().padStart(2, '0'); 
            return `${hours}:${minutes}`;

        },
        handlePostDeleted(result) {
      console.log("Post deleted successfully", result);
      this.$router.push('/profile');
    },

    }
  }
  </script>