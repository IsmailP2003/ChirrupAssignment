<template>
    <main class="text-primary">  
      <form @submit.prevent="handleSubmit">
        <button type="submit" class="btn btn-danger">Delete Post</button>
      </form>
    </main>
  </template>
  
  <script>
  import { postService } from "../../services/posts.service.js";
  
  export default {
    props: {
      postId: {
        type: String,
        required: true,
      },
    },
    methods: {
      handleSubmit() {
        postService.deletePost(this.$route.params.id)
          .then(result => {
            console.log("Successfully deleted post");
            this.$emit("post-deleted", result);
          })
          .catch(error => {
            console.error("Error deleting post", error);
          });
      },
    },
  };
  </script>
  