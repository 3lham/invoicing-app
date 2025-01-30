<template>
  <div class="container">
    <div class="tab-pane p-3 fade show active">
      <div class="row">
        <div class="col-md-12">
          <h3>Enter details below to create invoice</h3>
          <form @submit.prevent="onSubmit"> <!--poziva moju metodu onSubmit()-->
            <hr />
            <h3>Transactions </h3>
            <div class="form-group">
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#transactionModal">Add Transaction</button>

              <!-- Modal -->
              <div class="modal fade" id="transactionModal" tabindex="-1" aria-labelledby="transactionModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">Add Transaction</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div class="form-group mb-3">
                        <label for="txn_name_modal" class="form-label">Transaction name:</label>
                        <input id="txn_name_modal" type="text" class="form-control" v-model="newTransaction.name">
                      </div>
                      <div class="form-group mb-3">
                        <label for="txn_price_modal" class="form-label">Price ($):</label>
                        <input id="txn_price_modal" type="number" min=0 class="form-control" v-model="newTransaction.price">
                      </div> 
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Discard Transaction</button>
                      <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="saveTransaction">Save Transaction</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="form-group mb-3">
              <label for="create-invoice-name" class="form-label">Invoice Name:</label>
              <input id="create-invoice-name" type="text" required class="form-control" placeholder="Invoice Name" v-model="invoice.name">
            </div>

            <div class="form-group mb-3">
              Invoice Price: <span>${{ invoice.total_price }}</span> <!-- u transakcije ima ovo:
              price: parseFloat(this.newTransaction.price).toFixed(2) // Store price as a float with 2 decimal points
              pa kad ih spasi budu s dvije decimale
-->
            </div>

            <div class="col-md-12">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Transaction Name</th>
                    <th scope="col">Price ($)</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="txn in transactions" :key="txn.id">
                    <tr>
                      <th>{{ txn.id }}</th>
                      <td>{{ txn.name }}</td>
                      <td>{{ txn.price }} </td>
                      <td><button type="button" class="btn btn-danger" @click="deleteTransaction(txn.id)">Delete</button></td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <div class="form-group">
              <button class="btn btn-primary">Create Invoice</button>
              
              {{ loading }}
              {{ status }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CreateInvoice",
  props : ["user"],
  data() {
    return {
      invoice: {
        name: "",
        total_price: 0
      },
      transactions: [],
      nextTxnId: 1,
      loading: "",
      status: "",
      newTransaction: { // Reactive state for new transaction input
        name: "",
        price: 0.00,
      },
    };
  },
  methods: {
    saveTransaction() {
      // Check if the transaction name and price are valid
      if (this.newTransaction.name && this.newTransaction.price > 0) {
        // Append data to the transactions array
        this.transactions.push({
          id: this.nextTxnId,
          name: this.newTransaction.name,
          price: parseFloat(this.newTransaction.price).toFixed(2) // Store price as a float with 2 decimal points
        });

        this.calcTotal(); // Recalculate total
        this.nextTxnId++; // Increment transaction ID

        // Reset new transaction input fields
        this.newTransaction.name = "";
        this.newTransaction.price = 0;
      } else {
        alert("Please enter valid transaction details.");
      }
    },
    deleteTransaction(id) {
      this.transactions = this.transactions.filter(el => el.id !== id);
      this.calcTotal(); // Recalculate total after deletion
    },
    calcTotal() {
      this.invoice.total_price = this.transactions.reduce((acc, txn) => acc + parseFloat(txn.price), 0).toFixed(2); // Calculate total price
    },
    
    onSubmit() {
      
     if(this.transactions.length===0)
      {
        alert('Please add transactions to your invoice.'); //ukoliko nema transakcija, ne dozvoljavamo da spasi invoice
        return;
        
      }
      
    const formData = new FormData();
      this.transactions.forEach(element => {
        formData.append("txn_names[]", element.name);
        formData.append("txn_prices[]", element.price);
      });
        
      formData.append("name", this.invoice.name);
      formData.append("user_id", this.user.id); 
      this.loading = "Creating Invoice, please wait ...";

      // Post to server
      axios.post("http://localhost:3128/invoice", formData).then(res => {
        this.loading = "";

        if (res.data.status === true) {
          this.status = res.data.message;
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
