<template>
  <div>
    <nav class="navbar navbar-primary custom-navbar">      
      <router-link class="navbar-brand text-dark" to="/"> </router-link>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.custom-navbar {
  padding-top: 30px; 
  padding-bottom: 30px;
  background-color: black; 
}
</style>

<script>
export default {
  name: 'App',
  
};
</script>