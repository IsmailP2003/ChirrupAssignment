<template>
  <div>
    <nav class="navbar navbar-primary custom-navbar2">      
      <router-link class="navbar-brand text-dark" to="/"> </router-link>
      <router-link to="/" class="return-button btn btn-success">
        Return to Feed
      </router-link>
    </nav>

    <router-view />
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
export default {
  name: 'App',
  
};
</script>