<template>
  <form @submit.prevent="handleNewPost">
      <textarea id="newPostText" v-model="newPostText"></textarea>
      <button>Add post</button>
    </form>

</template>

<script>
import  {postService}   from "../../services/posts.service"

export default {
data() {
  return {
    newPostText: "",
    submitted: false,
    error: ""

  }
},
methods: {
  handleNewPost(e) {
      this.submitted = true
      const { newPostText } = this
      if(!newPostText) { 
          return; 
      }
      postService.addPost(this.newPostText)
      .then(result => {
          console.log("successfull")
          this.$emit("new-post-added", result)
          newPostText = ""
          
      })
      .catch(error => {
          this.error = error;
          this.submitted = false;
      });

  },
}
}
</script>