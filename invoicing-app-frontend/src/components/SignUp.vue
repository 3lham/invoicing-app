<template>
  <div class="container">
    <AppHeader />

    <ul class="nav nav-tabs" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab" aria-controls="login" aria-selected="true">Login</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button" role="tab" aria-controls="register" aria-selected="false">Register</button>
      </li>
    </ul>

    <div class="tab-content p-3">
      <div id="login" class="tab-pane fade show active" role="tabpanel" aria-labelledby="login-tab">
        <div class="row">
          <div class="col-md-12">
            <form @submit.prevent="login">
              <div class="form-group mb-3">
                <label for="login-email" class="label-form">Email:</label>
                <input id="login-email" type="email" required class="form-control" placeholder="example@example.com" v-model="model.email">
              </div>

              <div class="form-group mb-3">
                <label for="login-password" class="label-form">Password:</label>
                <input id="login-password" type="password" required class="form-control" placeholder="Password" v-model="model.password">
              </div>

              <div class="form-group">
                <button class="btn btn-primary">Log In</button>
                {{ loading }}
                {{ status }}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div id="register" class="tab-pane fade" role="tabpanel" aria-labelledby="register-tab">
        <div class="row">
          <div class="col-md-12">
            <form @submit.prevent="register">
              <div class="form-group mb-3">
                <label for="register-name" class="label-form">Name:</label>
                <input id="register-name" type="text" required class="form-control" placeholder="Full Name" v-model="model.name">
              </div>

              <div class="form-group mb-3">
                <label for="register-email" class="label-form">Email:</label>
                <input id="register-email" type="email" required class="form-control" placeholder="example@example.com" v-model="model.email">
              </div>

              <div class="form-group mb-3">
                <label for="register-company" class="label-form">Company Name:</label>
                <input id="register-company" type="text" required class="form-control" placeholder="Company Name" v-model="model.company_name">
              </div>

              <div class="form-group mb-3">
                <label for="register-password" class="label-form">Password:</label>
                <input id="register-password" type="password" required class="form-control" placeholder="Password" v-model="model.password">
              </div>

              <div class="form-group mb-3">
                <label for="register-confirm" class="label-form">Confirm Password:</label>
                <input id="register-confirm" type="password" required class="form-control" placeholder="Confirm Password" v-model="model.c_password">
              </div>

              <div class="form-group mb-3">
                <button class="btn btn-primary">Register</button>
                {{ loading }}
                {{ status }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AppHeader from "./AppHeader.vue"; 

export default {
  name: "SignUp",
  components: {
    AppHeader
  },
  data() {
    return {
      model: {
        name: "",
        email: "",
        password: "",
        c_password: "",
        company_name: "",
      },
      loading: "",
      status: "",
    };
  },

  
  methods: {
    validate() {
      // checks to ensure passwords match
      /*
      if (this.model.password != this.model.c_password) {
        return false;
      }
      return true;
    },radi na oba nacina tkd svejedno
      */

      return this.model.password === this.model.c_password; // Using strict comparison
    },
  
    register() {
      const formData = new FormData();
      let valid = this.validate();

      if (valid) {
        formData.append("name", this.model.name);
        formData.append("email", this.model.email);
        formData.append("company_name", this.model.company_name);
        formData.append("password", this.model.password);

        this.loading = "Registering you, please wait";

        // Post to server
      

        axios.post("http://localhost:3128/register", formData).then(res => {
          this.loading = "";

          if (res.data.status == true){
            // store the user token and user data in localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            this.$router.push({
              name: "DashBoard",
            });
          } 
          else {
            this.status = res.data.message;
          }
        });
      } 
        else {
        alert("Passwords do not match");
      }
    },
   
    login() {
      const formData = new FormData();

      formData.append("email", this.model.email);
      formData.append("password", this.model.password);
      this.loading = "Logging In";

      // Post to server
      axios.post("http://localhost:3128/login", formData).then(res => {
        this.loading = "";
      
        if (res.data.status === true) {
            // store the data in localStorage
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));        
            this.$router.push({
            name: "DashBoard",
            //params: { user: JSON.stringify(res.data.user) }, ovo sad ne treba
          });
        } else {
          this.status = res.data.message;
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
