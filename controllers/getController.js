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

const getForCreatePayment = async(req, res) => {
    Client.find()
        .then(clientData => {
            const clientsLog = clientData[0].clients.map(client => {
                const obj = {};
                obj.party_name = client.party_name;
                obj._id = client._id;
                obj.balance = client.balance;
                obj.unsettled_invoice = clientData[0].sales_invoice.filter(invoice => (invoice.party_name == client.party_name && invoice.balance != 0));
                return obj;
            });
            res.json({success: true, clients: clientsLog});
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
            transactionLogg = transactionLog.map(({party_name, payment_id, date, tot_amount}) => ({
                party_name, payment_id, date, tot_amount
            }));
            res.json({success: true, allTransaction : transactionLogg });
        })
        .catch(err => {
            console.log(err);
        })
}

const getInvoiceById = async(req,res) => {  //Function for getting a particular invoice or payment details and here is the id of that Invoice object and not ClientsDB _id.
    const id = req.params.id;
    Client.find()
        .then(clientData => {
            invoice = clientData[0].sales_invoice.filter(invoice => invoice.invoice_number === id);
            res.json({success:true, invoice: invoice[0]});
        })
        .catch(err => {
            console.log(err);
        }) 
}

const getPaymentById = async(req,res) => { 
    const id = req.params.id;
    Client.find()
        .then(clientData => {
            payment = clientData[0].transactions.filter(payment => payment.payment_id === id);
            res.json({success:true, payment: payment[0]});
        })
        .catch(err => {
            console.log(err);
        }) 
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

const getItems = async(req, res) => {
    Client.find()
        .then(clientData => {
            const items = clientData[0].items;
            itemLog = items.map(({name, _id, hsn_code, stock, sales_price}) => ({
                name, _id, hsn_code, stock, sales_price
            }));
            res.json({success: true, allItems : itemLog });
        })
        .catch(err => {
            console.log(err);
        })
}

const getItemById = async(req, res) => {
    const id = req.params.id;
    Client.find()
        .then(clientData => {
            const items = clientData[0].items;
            itemLog = items.filter((item) => {
               return item._id == id;
            })
            res.json({success: true, allItems : itemLog[0] });
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    getForCreateInvoice,
    getForCreatePayment,
    getClientById,
    getClients,
    getTransactionOfType,
    getItems,
    getItemById,
    getInvoiceById,
    getPaymentById
}