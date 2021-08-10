const Client = require('../models/client-model');
const _ = require("lodash");

const deleteItem = async(req, res) => {
    const id = req.params.id;
    Client.find()
        .then(clientData => {
            const deleted = clientData[0].items.filter(item => item._id != id); 
            clientData[0].items = [...deleted];
            clientData[0].save();
            return res.json({data: clientData[0].items});
        })
        .catch(err => {
            console.log(err);
        })
}

const deleteClient = async(req, res) => {
    const id = req.params.id;
    Client.find()
        .then(clientData => {
            const deleted = clientData[0].clients.filter(client => client._id != id); 
            clientData[0].clients = [...deleted];
            clientData[0].save();
            return res.json({data: clientData[0].clients});
        })
        .catch(err => {
            console.log(err);
        })
}

const deleteInvoice = async(req, res) => {
    const id = req.params.id;
    Client.find()
        .then(clientData => {
            const deleted = clientData[0].sales_invoice.filter(invoice => invoice._id != id); 
            clientData[0].sales_invoice = [...deleted];
            clientData[0].save();
            return res.json({data: clientData[0].sales_invoice});
        })
        .catch(err => {
            console.log(err);
        })
}

const deleteTransaction = async(req, res) => {
    const id = req.params.id;
    Client.find()
        .then(clientData => {
            const deleted = clientData[0].transactions.filter(transaction => transaction._id != id); 
            clientData[0].transactions = [...deleted];
            clientData[0].save();
            return res.json({data: clientData[0].transactions});
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    deleteItem,
    deleteClient,
    deleteTransaction,
    deleteInvoice
}