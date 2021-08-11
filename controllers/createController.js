const Client = require('../models/client-model');
const _ = require("lodash");


const createItem = async(req, res)=>{
    const obj = req.body;
    if(obj.sales_price) obj.stock = _.toNumber(obj.stock);
    if(obj.sales_price) obj.sales_price = _.toNumber(obj.sales_price);
    if(obj.sales_price) obj.purchase_price = _.toNumber(obj.purchase_price);
    Client.find()
        .then(clientData => {
            const result = clientData[0];
            const exist = result.items.filter(item => item.name == req.body.name);
            if(exist.length){
                return res.json({sucess: false, message: "Item with that name already Exists"});
            }
            else{
                result.items.push(obj);
                result.save();
                return res.json({success:true, item: result.items[result.items.length-1]});    
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const createClient = async(req, res) => {
    req.body.total_amount = 0;
    req.body.total_paid_amount = 0;
    const obj = req.body;
    Client.find()
        .then(clientData => {
            const result = clientData[0];
            const exist = result.clients.filter(client => client.party_name == req.body.party_name);
            if(exist.length){
                return res.json({sucess: false, message: "Item with that name already Exists"});
            }
            else{
                result.clients.push(obj);
                result.save();
                return res.json({success:true, item: result.clients[result.clients.length-1]});    
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const createInvoice = async (req, res) =>{
    const obj = req.body;
    obj.total_bill = _.toNumber(obj.total_bill);
    obj.invoice_items.map(item => {
        item.quantity = _.toNumber(item.quantity);
    });
    Client.find()
        .then(clientData => {
            const result = clientData[0];
            result.sales_invoice.push(obj);
            const newObj = {
                party_name: obj.party_name,
                typ: "Invoice",
                payment_id: obj.invoice_number,
                amount: obj.total_bill,
                date: obj.invoice_date,
                notes: obj.notes
            }
            const client = result.clients.filter(client => client.party_name === obj.party_name);
            client[0].balance += obj.total_bill;
            result.transactions.push(newObj);
            result.save();
        })
        .catch(err => {
            console.log(err);
        });
}

const createTransaction = async (req, res) =>{
    const obj = req.body;
    obj.typ = "Payment";
    obj.amount = _.toNumber(obj.amount);
    Client.find()
        .then(clientData => {
            const result = clientData[0];

            const client = result.clients.filter(client => client.party_name === obj.party_name);
            client[0].balance -= obj.amount;

            result.transactions.push(obj);
            result.save();
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = {
    createItem,
    createClient,
    createInvoice,
    createTransaction
}