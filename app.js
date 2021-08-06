const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const Client = require("./models/client-model.js")
const createRoutes = require('./routes/createRoutes');

const app = express();

const dbURL = "mongodb://localhost:27017/clientDB";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000))
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
            const transact = transactionLog.map(({party_name, _id, typ, date, amount}) => ({
                party_name, _id, typ, date, amount
            }));
            res.json({success: true, allTransaction : transact});
        })
        .catch(err => {
            console.log(err);
        })
});

app.use("/create", createRoutes); //MVC

app.get("/clients", async(req, res)=>{ //returns all clients
    Client.find()
        .then(clientData => {
            const clientsLog = clientData[0].clients.map(({party_name, _id, mobile_number, balance}) => ({
                party_name, _id, mobile_number, balance
            }));
            res.json({success: true, allClients: clientsLog });
        })
        .catch(err => {
            console.log(err);
        })
})

app.get("/:type", async(req, res) => {   //All data for (payment in) and (invoices generated) page separately.
    const type = req.params.type;
    Client.find()
        .then(clientData => {
            const transactionLog = clientData[0].transactions.filter(trans => trans.typ == type);
            transactionLogg = transactionLog.map(({party_name, _id, payment_id, date, amount}) => ({
                party_name, _id, payment_id, date, amount
            }));
            res.json({success: true, allTransaction : transactionLogg });
        })
        .catch(err => {
            console.log(err);
        })
})

app.get("/transaction/:id", async(req,res) => {  //Function for getting a particular invoice or payment details and here is the id of that transaction object and not ClientsDB _id.
    const id = req.params.id;
    await Client.find({}, (err, clientData) => {
        if(err){
            console.log(err);
        }
        const data = clientData[0].transactions.filter(trans => trans._id == id);
        console.log(data);
        if(!data.length){
            return res.json({success: false, message: "No such Transaction Log"});
        }
        if(data.typ === "payment"){
            return res.json({success: true, transaction_type:"payment", data: data});
        }
        if(data.typ === "invoice"){
            const data_invoice = clientData[0].sales_invoice.filter(invoice => invoice.invoice_number == data.payment_id);
            return res.json({success: true, transaction_type:"invoice", data: data_invoice});
        }
    });
})

app.get("/client/:id", async(req, res) => { //detail of a particular client fetched using that particular client's Object_id
    const id = req.params.id;
    Client.find()
        .then(clientData => {
            const clientsLog = clientData[0].clients;
            const client = clientsLog.filter(client => client._id == id);
            if(!client.length){
                return res.json({success:false, message: "No such client Found!"});
            }
            else{
                const transac = clientData[0].transactions.filter(trans => {
                    trans.party_name == client[0].party_name
                });
                const transacc = transac.map(({ _id, payment_id, date, typ, amount}) => ({
                     _id, payment_id, date, typ, amount
                }));
                return res.json({success:true, client: client[0], transaction: transacc});
            }
        })
        .catch(err => {
            console.log(err);
        }) 
})

