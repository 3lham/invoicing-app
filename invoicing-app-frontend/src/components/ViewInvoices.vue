<template>
  
  <div>
    <div class="tab-pane p-3 fade show active">
      <div class="row">
        <div class="col-md-12">
          <h3>Here is a list of your invoices</h3>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Invoice #</th>
                <th scope="col">Invoice Name</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <!-- Place key on the template tag -->
              <template v-for="invoice in invoices" :key="invoice.id">
                <tr>
                  <th scope="row">{{ invoice.id }}</th>
                  <td>{{ invoice.name }}</td>
                  <td v-if="invoice.paid === 0">Unpaid</td> <!-- Using strict equality -->
                  <td v-else>Paid</td>
                  
                  <td>
                    <router-link :to="{ name: 'SingleInvoice', params: {isactive: 'view', invoice_id: invoice.id }}" 
                    class="btn btn-success" >To Invoice</router-link>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
      name: "ViewInvoices",
      components: {},
      data() {
        return {
          invoices: [],
          user: '',
          user_id: '',
        };
      },
      mounted() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.user_id= this.user.id;
        console.log('id usera:',this.user_id);
        axios
          .get(`http://localhost:3128/invoice/user/${this.user.id}`,
            {
              headers: {"x-access-token": localStorage.getItem("token")}
            })
          .then(res => {
            if (res.data.status == true) {
              console.log(res.data.invoices);
              this.invoices = res.data.invoices;
            }
            else {
              localStorage.removeItem('user'); //ovo radim da bi kad proba ici nazad mu izbacilo error

              alert('Your session has expired. Please log back in.');//kad istekne token
              this.user = null;
              this.$router.push({
              name: "SignUp",
            });
    }
        /*  }).catch(error => {
    // Handle network errors and potential token issues
    if (error.response && error.response.status === 401) {
      // Likely token issue (401: Unauthorized)
      this.showTokenErrorPopup(); // Call method to show popup
    } else {
      // Handle other network errors
      console.error("Network error:", error); // Example
    } ne radi mi*/
  });
      },
 
    };
</script>
