const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const Client = require("./models/client-model.js");
const createRoutes = require('./routes/createRoutes');
const getRoutes = require('./routes/getRoutes');
const updateRoutes = require('./routes/updateRoutes');
const deleteRoutes = require('./routes/deleteRoutes');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {checkUser, authent, admin } = require('./middleware/authMiddleware');

const createController = require('./controllers/createController');

const app = express();

const dbURL = "mongodb://localhost:27017/clientDB";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(cookieParser());    //CookieParser
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
// If there is no data in MongoDB this will create an empty dummy data in it.
// Client.find()   
//     .then(clientData => {
//         if(!clientData.length){
//             const client = new Client;
//             client.total_sales=0;
//             client.total_paid=0;
//             client.total_unpaid=0;
//             client.total_balance=0;
//             client.to_collect=0;
//             client.to_pay=0;
//             client.save();
//         }
//     })
//     .catch(err => {
//         if(err) console.log(err);
//     });

// For SuperAdmin you can do on ething that you in localhost//:3000/ (home route) you can add a check that if the array or database is empty then in that case you can send a page that will ask for super admin signup and things like company logo, admin name etc and that user will be the super-admin of that database.

app.get("/all", (req, res) => {
    Client.find()
        .then(clientData => {
            res.json(clientData[0]);
        });
})

app.post("/register", createController.createCompany);
app.post("/login", createController.loginUser);

app.get("*", checkUser); //Checking if users token exists and is valid or not
app.post("*", checkUser); //Checking if users token exists and is valid or not
app.delete("*", checkUser); //Checking if users token exists and is valid or not

app.post("/signup", admin, createController.createUser);

app.get("/", authent, (req,res)=>{ //For Homepage This will return All Transactions
    Client.find()
        .then(clientData => {
            const transactionLog = clientData[0].transactions;
            transactionLog.reverse(); //Sorted in order of time it was created
            const transact = transactionLog.map(({party_name, payment_id, typ, date, tot_amount}) => ({
                party_name, payment_id, typ, date, tot_amount
            }));
            res.json({success: true, allTransaction : transact});
        })
        .catch(err => {
            console.log(err);
        })
});

app.use("/create", createRoutes); //MVC
app.use("/get", getRoutes); //MVC
app.use("/update", updateRoutes); //MVC
app.use("/delete", deleteRoutes); //MVC

