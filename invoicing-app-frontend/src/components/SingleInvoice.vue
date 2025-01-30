<template>
  <div class="container">
      <AppHeader v-bind:user="user" />

<template v-if="this.user!=null">
      <!--  display invoice data -->
      <div class="invoice">
        <!-- display invoice name here -->
        <div class="container">
          <div class="row">
              <div class="col-md-12">
                <h3>Invoice #{{ invoice.id }} by {{ user.company_name }}</h3>
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Transaction Name</th>
                      <th scope="col">Price ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="txn in transactions" :key="txn.id">
                      <tr>
                        <th>{{ txn.id }}</th>
                        <td>{{ txn.name }}</td>
                        <td>{{ txn.price }} </td>
                      </tr>
                    </template>
                  </tbody>
                  <tfoot>
                    <td></td>
                    <td style="text-align: right">Total :</td>
                    <td><strong>$ {{ total_price }}</strong></td>
                  </tfoot>
                </table>
              </div>
            </div>
            <div class="row">
              <form @submit.prevent="send" class="col-md-12">
                <h3>Enter Recipient's Name and Email to Send Invoice</h3>
                <div class="form-group">
                  <label for="">Recipient Name</label>
                  <input type="text" required class="form-control" placeholder="eg Chris" v-model="recipient.name">
                </div>
                <div class="form-group">
                  <label for="">Recipient Email</label>
                  <input type="email" required placeholder="eg chris@invoiceapp.com" class="form-control" v-model="recipient.email">
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" >Send Invoice</button>
                    {{ loading }}
                    {{ status }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </template>

<template v-else>
  <div class="image-container">
    <img src="./error.gif" alt="Error GIF">
  </div>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <h3 style="text-align: center;">Oops! Looks like you are not signed in.</h3> 
    <a id="signup" class="btn btn-primary" v-on:click="signup()" style="color: white">
      Sign In
    </a>
  </div>
</template>
 </div>

</template>

<script>
    import AppHeader from "./AppHeader"; 
    import axios from "axios";
    export default {
      name: "SingleInvoice",
      components: {
        AppHeader
      },
      data() {
        return {
          isactive:'view',
          invoice: {},
          transactions: [],
          user: '',
          total_price: 0,
          recipient : {
            name: '',
            email: ''
          },
          loading : '',
          status: '',
        };
      },
      watch:{
        '$route': {
            handler() {
            this.fetchUser();
      },
            immediate: true, 
    },
      },
      methods: {
        fetchUser(){
          if(localStorage.getItem("user")){
            this.user=localStorage.getItem("user");
          }
          else{
            this.user=null; //ovo mi treba zato sto zelim da kad se log out-a i zeli back da mu vrati error
            //tj da uhvati da je user null pa da ne prikazuje stranicu
          }
        },

        signup(){
        this.$router.push({
              name: "SignUp",
            });
      },
        send() {
          this.status = "";
          this.loading = "Sending Invoice, please wait....";
          
          const formData = new FormData();
          formData.append("user", JSON.stringify(this.user));
          formData.append("recipient", JSON.stringify(this.recipient));
          formData.append("invoice_name", this.invoice.name);
          formData.append("transactions", JSON.stringify(this.transactions));
          console.log(this.recipient);
          axios.post("http://localhost:3128/sendmail", formData, {
            headers: {"x-access-token": localStorage.getItem("token")}
          }).then(res => {
            this.loading = '';
            this.status = res.data.message
          }); 
        }
      },
     
      mounted() {
        this.user = JSON.parse(localStorage.getItem("user"));
        let token = localStorage.getItem("token");
        let invoice_id = this.$route.params.invoice_id;
        
        if (this.user) { // Check if user exists in localStorage
          let potrebni_id = this.user.id;
            axios.get(`http://localhost:3128/invoice/user/${potrebni_id}/${invoice_id}`, {
            headers: {
              "x-access-token": token
            }
          })
          .then(res => {
            if (res.data.status == true) {
              this.transactions = res.data.transactions;
              this.invoice = res.data.invoices;
              let total = 0;
              this.transactions.forEach(element => {
                total += parseFloat(element.price);
              });
              this.total_price = total.toFixed(2);
            }
            else{//kad istekne token
              localStorage.removeItem('user'); //ovo radim da bi mu kad proba ici nazad izbacilo error 
              //- ne moze mi back ali svejedno, ako se ukuca http://localhost:8080/#/invoice/user/invoices/1 izbaci stranicu sa errorom
              alert('Your session has expired. Please log back in.');//kad istekne token
              this.user = null;
              this.$router.push({
              name: "SignUp",
            });
            }
          });
  } else {
    // ovo sam rijesila sa ovim templateom gore, ako nema usera onda ide error page
    //console.error('User not found in localStorage'); 
  }

        
      },
      

    };
    </script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #426cb9;
}
.single-page {
  background-color: #ffffffe5;
}
.invoice{
  margin-top: 20px;
}




.image-container img{
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