const Client = require('../models/client-model');
const _ = require("lodash");

const getForCreateInvoice = async(req, res) => {
    Client.find()
        .then(clientData => {
            const clientsLog = clientData[0].clients.map(({party_name, _id, balance}) => ({
                party_name, _id, balance
            }));
            const itemLog = clientData[0].items.map(({name, _id, sales_price}) => ({
                name, _id, sales_price
            }));
            res.json({success: true, clients: clientsLog, items: itemLog});
        })
        .catch(err => {
            console.log(err);
        }); 
}

const getClients = async(req, res)=>{ //returns all clients
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
}

const getTransactionOfType = async(req, res) => {   //All data for (payment in) and (invoices generated) page separately.
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
}

const getTransactionById = async(req,res) => {  //Function for getting a particular invoice or payment details and here is the id of that transaction object and not ClientsDB _id.
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
}

const getClientById = async(req, res) => { //detail of a particular client fetched using that particular client's Object_id
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
}

module.exports = {
    getForCreateInvoice,
    getClientById,
    getClients,
    getTransactionOfType,
    getTransactionById
}