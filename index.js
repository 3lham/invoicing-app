const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3128 ;

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

 

const _ = require('lodash');

const multer  = require('multer');
const upload = multer();

const bcrypt = require('bcrypt');
const saltRounds = 10;


// GET /invoice/user/:user_id - begin

app.get('/invoice/user/:user_id', function(req, res) {
  console.log(`Received request for user_id: ${req.params.user_id}`);
  const db = new sqlite3.Database('./database/InvoicingApp.db');

  // Corrected SQL query
  const sql = `SELECT * FROM invoices WHERE user_id = ? ORDER BY id;`;
  
  db.all(sql, [req.params.user_id], (err, rows) => {
      if (err) {
          db.close(); // Close the database connection in case of error
          return res.status(500).json({ "status": false, "error": err.message });
      }
      db.close(); // Close the database connection
      return res.json({
          "status": true,
          "invoices": rows // Respond with the retrieved invoices
      });
  });
});


// GET /invoice/user/:user_id - end

// GET /invoice/user/:user_id/:invoice_id - begin

app.get('/invoice/user/:user_id/:invoice_id', upload.none(), function(req, res) {
    let db = new sqlite3.Database('./database/InvoicingApp.db');
  
    let sql = `SELECT * FROM invoices LEFT JOIN transactions ON invoices.id=transactions.invoice_id WHERE user_id='${req.params.user_id}' AND invoice_id='${req.params.invoice_id}' ORDER BY transactions.id`;
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
  
      return res.json({
        "status": true,
        "transactions": rows
      });
    });
  });
  
  // GET /invoice/user/:user_id/:invoice_id - end
  
  // set application port
  // ...


  app.listen(PORT, function() {
    console.log(`App running on localhost:${PORT}.`);
  });