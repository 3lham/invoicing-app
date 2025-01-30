<template>
  <div class="container">
    <AppHeader v-bind:user="user"/>
    
    <template v-if="this.isactive == 'create' && this.user!= null" > <!--uslov za usera - kad je ulogovan -->
      <CreateInvoice v-bind:user="user"/>
    </template>
    <template v-else-if="this.isactive == 'view' && this.user!= null" >
      <ViewInvoices v-bind:user="user" />
    </template>
    <template v-else> <!--kad je izlogovan, ali ide na link za dashboard-->
      <div class="image-container">

        <img src="./error.gif" alt="Error GIF">


      </div>
      <div style="display: flex; flex-direction: column; align-items: center;">
      
      <h3>Oops! Looks like you are not signed in.</h3> 
      <a id="signup" class="btn btn-primary" v-on:click="signup()">
           Sign In
      </a>
    </div>
    </template>
  </div>
  
</template>
<script>

import AppHeader from "./AppHeader";
import CreateInvoice from "./CreateInvoice";
import ViewInvoices from "./ViewInvoices";

export default {
  name: "DashBoard",
  components: {
    AppHeader,
    CreateInvoice,
    ViewInvoices,
  },
  data() {
    return {
      isactive: 'view', //ovo je nebitno jer se gleda u created
      title: "Invoicing App",
      user : null, 
  }},
 
  created() {
    // Access the isActive parameter from the route and update the data property
    if(this.$route.params.isactive){  //ako vec ima u ruti, to je kad idem sa singleinvoice na ovaj dash
      this.isactive = this.$route.params.isactive;

    }
    else{ //ovo je na pocetku, kad se uloguje
      this.isactive='create';
    }
  },
  mounted(){
      this.user = JSON.parse(localStorage.getItem("user"));
      
    },
    methods:{
      signup(){
        this.$router.push({
              name: "SignUp",
            });
      }
    }
  };

</script>
<style scoped>

h3{
  text-align: center;
}
img{
  width: 75%;
}
.image-container {

  display: flex;
  justify-content: center;
}
#signup{
  margin: 1em;
  font-size: large;
}
</style>