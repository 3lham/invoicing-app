
<template>
  <div class="flex-grow-1">
    <div class="navbar navbar-expand-lg" >
      <ul class="navbar-nav flex-grow-1 flex-row">
        <li class="nav-item">
          <a class="nav-link" v-on:click="setActive('create')">Create Invoice</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" v-on:click="setActive('view')">View Invoices</a>
        </li>
        
      </ul>
    
      <a id="logout" class="btn btn-primary" v-on:click="logout()">
          <span class="glyphicon glyphicon-log-out"></span> Log out
      </a>
    </div>
    <div class="navbar-text tekst1"><em>Company: {{ company }}</em></div>
    <div class="navbar-text h3">Welcome, {{ name }}
    </div>
  
      
  </div>
</template>


<script>


export default {
  name: "AppNavigation",
  props: ["name", "company"],
  methods: {
   setActive(option) {
      this.$parent.$parent.isactive = option; //parent je app header a parent.parent je dashboard
      this.$router.push({ name: 'DashBoard', params: { isactive: option } }); 
      //sad kad ovo dodam predje mi na dashboard ali uzima mi create jer je tamo to default

    },
    logout(){
      console.log('Hellooo');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.user = null;
      this.$router.push({
              name: "SignUp",
            });

    }
  }
};

</script>
<style scoped>


li a{
  padding-left: 1rem;
  font-size: 1.2rem; 
  font-weight: 500;
}
#logout{
  background-color:rgb(199, 82, 82);
  border: 0cap;
  font-weight: 500;
  float: right;
}
.navbar-text{
  padding-left: 0.5rem;
}
.tekst1{
  font:1.5rem  bold;
}
</style>
