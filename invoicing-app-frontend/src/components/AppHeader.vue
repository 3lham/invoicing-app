<template>
  <nav class="navbar navbar-light bg-light">
    <div class="navbar-brand m-0 p-3 h1 align-self-start">
    {{title}}
      
    </div>
    <template v-if="user != null">
      <AppNavigation v-bind:name="user.name" v-bind:company="user.company_name"/>
    
    </template>
  </nav>
</template>

<script>
import AppNavigation from "./AppNavigation.vue"; 

export default {
  name: "AppHeader",
  props : ["user"],
  components: {
    AppNavigation,
  },
  data() {
    return {
      title: "Invoicing App",
      isActive: null,
    };
  }
};
</script>