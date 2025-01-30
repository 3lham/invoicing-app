const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3128;
// import node modules
const jwt = require("jsonwebtoken");
let nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'invoicingappcompany@gmail.com',
    pass: 'mcjb gbno ykrv oupr'
  }
});

const multer = require('multer'); // za onu funkciju multipartMiddleware
const upload = multer();

const app = express();

app.set('appSecret', 'secretforinvoicingapp'); // this will be used later

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(cors());

app.get('/', function(req, res) {
    res.send('Welcome to Invoicing App.');
  });

// POST /register - begin

app.post('/register', upload.none(), function(req, res) {
  // check to make sure none of the fields are empty
  if (
    _.isEmpty(req.body.name)
    || _.isEmpty(req.body.email)
    || _.isEmpty(req.body.company_name)
    || _.isEmpty(req.body.password)
  ) {
    return res.json({
      "status": false,
      "message": "All fields are required!"
    });
  }

  // any other intended checks

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

    let db = new sqlite3.Database('./database/InvoicingApp.db');

    let sql = `INSERT INTO
                users(
                  name,
                  email,
                  company_name,
                  password
                )
                VALUES(
                  '${req.body.name}',
                  '${req.body.email}',
                  '${req.body.company_name}',
                  '${hash}'
                )`;
    /*    ovaj kod je bio dok nismo radile s tokenima
    db.run(sql, function(err) {
      if (err) {
        throw err;
      }
      else {
        const newUserId=this.lastID;
        return res.json({
          "status": true,
          "message": "User Created.",
          "user": {
            id: newUserId,
            name: req.body.name,
            company_name: req.body.company_name,
            email: req.body.email
          }
        });
      }
    });
  */
  db.run(sql, function(err) {
    if (err) {
      throw err;
    } else {
      let user_id = this.lastID;
      let query = `SELECT * FROM users WHERE id='${user_id}'`;
      db.all(query, [], (err, rows) => {
        if (err) {
          throw err;
        }
        let user = rows[0];
        delete user.password;
        //  create payload for JWT
        const payload = {
          user: user 
        }
        // create token
        let token = jwt.sign(payload, app.get("appSecret"), {
          expiresIn: "3h" // moze se podesit nakon koliko vremena istice token
        });
        // send response back to client
        return res.json({
          status: true,
          token : token,
          user: user
        });
      });
    }
  });
  db.close();
});
});



// POST /register - end

// POST /login - begin

app.post('/login', upload.none(), function(req, res) {
    let db = new sqlite3.Database('./database/InvoicingApp.db');
  
    let sql = `SELECT * from users where email='${req.body.email}'`;
  
    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
  
      db.close();
  
      if (rows.length == 0) {
        return res.json({
          "status": false,
          "message": "Sorry, wrong email."
        });
      }
  
  

  let user = rows[0];

  let authenticated = bcrypt.compareSync(req.body.password, user.password);

  delete user.password;
      /*
  if (authenticated) {
    return res.json({
      "status": true,
      "user": user
    });
  }*/
  if (authenticated) {
    //  create payload for JWT
    const payload = { user: user };
    // create token
    let token = jwt.sign( payload, app.get("appSecret"),{
      expiresIn: "3h" // nakon 3 sata vise ne vrijedi; ovo se moze namjestiti na par sekundi da se vidi sta se desi kad istekne token
    });
    return res.json({
      status: true,
      token: token,
      user: user
    });
  }

  return res.json({
    "status": false,
    "message": "Wrong password. Please retry."
  });
});

});

// POST /login - end

// POST /invoice - begin

app.post('/invoice', upload.none(), function(req, res) {
  // validate data
  if (_.isEmpty(req.body.name)) {
    return res.json({
      "status": false,
      "message": "Invoice needs a name!"
    });
  
  }


// create invoice
let db = new sqlite3.Database('./database/InvoicingApp.db');

let sql = `INSERT INTO invoices(
              name,
              user_id,
              paid
            )
            VALUES(
              '${req.body.name}',
              '${req.body.user_id}',
              0
            )`;

    

db.serialize(function() {
  db.run(sql, function(err) {
    if (err) {
      throw err;
    }

    let invoice_id = this.lastID;

    for (let i = 0; i < req.body.txn_names.length; i++) {
      let query = `INSERT INTO
                    transactions(
                      name,
                      price,
                      invoice_id
                    ) VALUES(
                      '${req.body.txn_names[i]}',
                      '${req.body.txn_prices[i]}',
                      '${invoice_id}'
                    )`;

      db.run(query);
    }

    return res.json({
      "status": true,
      "message": "Invoice created."
    });
  });
});

});
// POST /invoice - end




// Create middleware for protecting routes

app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get("appSecret"), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
  });

// SEND MAIL 
 
app.post("/sendmail", upload.none(), function(req, res) {
  // get name  and email of sender
  let sender = JSON.parse(req.body.user);
  let recipient = JSON.parse(req.body.recipient);
  let invoice_name= req.body.invoice_name;
  let transactions = JSON.parse(req.body.transactions);
  let total = 0;
  let trans1=[]
  transactions.forEach(element => {
    trans1.push({
      name: element.name,
      price: element.price,
    });
    total += parseFloat(element.price);
  });
  let total_price = total.toFixed(2);
  const formattedText = trans1.map(element => `Product: ${element.name} with the price of $${element.price}`).join(".\n");


  let mailOptions = {
    from: "invoicingappcompany@gmail.com",
    to: recipient.email,
    subject: `Hi, ${recipient.name}. Here's an Invoice from ${
      sender.company_name
    }`,
    text: `Hi, ${recipient.name}. We hope you're doing well. We would like to let you know about the "${invoice_name}" invoice that you created at the ${sender.company_name}. This invoice consists of the following:`,
    text1: formattedText
    
  };
  mailOptions.text+="\n"+mailOptions.text1+"\n\nThe total amount you owe is $"+ total_price+". The payment period lasts 30 days, starting today."+ "\nIf you have any questions, feel free to contact us."+ "\n\nKind regards,"+"\n\nThe Invoicing App Team.";

  delete mailOptions.text1; 

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return res.json({
        status: 200,
        message: `Error sending mail to ${recipient.name}`
      });
    } else {
      return res.json({
        status: 200,
        message: `Email sent to ${recipient.name}`
      });
    }
  });
});

// GET /invoice/user/:user_id - Begin
app.get('/invoice/user/:user_id', function(req, res) {
  const db = new sqlite3.Database('./database/InvoicingApp.db');

  // SQL query to fetch invoices for the specific user_id
  const sql = `SELECT * FROM invoices WHERE user_id = ? ORDER BY id;`;

  db.all(sql, [req.params.user_id], (err, rows) => {
      if (err) {
          db.close();
          return res.status(500).json({ "status": false, "error": err.message });
      }
      db.close();
      return res.json({
          "status": true,
          "invoices": rows // Return the retrieved invoices
      });
  });
});
// GET /invoice/user/:user_id - End
  

const _ = require('lodash');

const bcrypt = require('bcrypt');
const saltRounds = 10;


// GET /invoice/user/:user_id/:invoice_id - begin

app.get('/invoice/user/:user_id/:invoice_id', upload.none(), function(req, res) {
  let db = new sqlite3.Database('./database/InvoicingApp.db');

  let sql = `SELECT * FROM invoices LEFT JOIN transactions ON invoices.id=transactions.invoice_id WHERE user_id='${req.params.user_id}' AND invoice_id='${req.params.invoice_id}' ORDER BY transactions.id`;
  let sql1 = `SELECT * FROM invoices WHERE user_id='${req.params.user_id}' AND id='${req.params.invoice_id}'`;
  //const invoices={};
  
  db.all(sql1, [], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length == 0) {
      return res.json({
        "status": false,
        "message": "Sorry, wrong invoice_id."
      });
    }
  
    let invoices = rows[0];
    db.all(sql, [], (err, rows) => {
      if (err) {
      throw err;
      }
    db.close();

    return res.json({
      "status": true,
      "transactions": rows,
      "invoices": invoices
    });
    
  });
});
});

// GET /invoice/user/:user_id/:invoice_id - end



// create express app
//[...]
//app.set('appSecret', 'secretforinvoicingapp'); // this will be used later

app.listen(PORT, function() {
  console.log(`App running on localhost:${PORT}.`);
});