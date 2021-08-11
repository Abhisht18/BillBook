const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const cors=require('cors');
const Client = require("./models/client-model.js")
const createRoutes = require('./routes/createRoutes');
const getRoutes = require('./routes/getRoutes');
const deleteRoutes = require('./routes/deleteRoutes');

const app = express();
app.use(cors());
//const dbURL = "mongodb://localhost:27017/clientDB";

const dbURL='mongodb+srv://sagarmongodb:9937170872@cluster0.hh7px.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(4000))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
// If there is no data in MongoDB this will create an empty dummy data in it.
Client.find()   
    .then(clientData => {
        if(!clientData.length){
            const client = new Client;
            client.total_sales=0;
            client.total_paid=0;
            client.total_unpaid=0;
            client.total_balance=0;
            client.to_collect=0;
            client.to_pay=0;
            client.save();
        }
    })
    .catch(err => {
        if(err) console.log(err);
    });

app.get("/", (req,res)=>{ //For Homepage This will return All Transactions
    Client.find()
        .then(clientData => {
            const transactionLog = clientData[0].transactions;
            transactionLog.reverse(); //Sorted in order of time it was created
            const transact = transactionLog.map(({party_name, _id, typ, date, amount,payment_id}) => ({
                party_name, _id, typ, date, amount,payment_id
            }));
            res.json({success: true, allTransaction : transact});
        })
        .catch(err => {
            console.log(err);
        })
});

app.use("/create", createRoutes); //MVC
app.use("/get", getRoutes); //MVC
app.use("/delete", deleteRoutes); //MVC

