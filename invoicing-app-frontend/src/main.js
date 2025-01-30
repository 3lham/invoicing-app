
//import { createApp } from 'vue'
//import App from './App.vue'
//createApp(App).mount('#app')

import { createApp } from 'vue'
import { createRouter, createWebHashHistory} from 'vue-router'

import App from './App.vue'
import SignUp from './components/SignUp.vue'
import DashBoard from './components/DashBoard.vue'
import SingleInvoice from './components/SingleInvoice.vue'

const router = createRouter({
    //history:  createWebHistory(), //pokusala s ovim medjutim ne moze kad se refreshuje stranica
    //base: process.env.BASE_URL,

    history: createWebHashHistory(), //s ovim radi ali dodaje '#' u link
    routes: [
        { path: '/', name: 'SignUp', component: SignUp },
        { path: '/dashboard', name: 'DashBoard', component: DashBoard },
        {  path: '/invoice/user/invoices/:invoice_id',
            name: 'SingleInvoice',
            component: SingleInvoice},
    ]
});

const app = createApp(App)
app.use(router);


app.mount('#app')
