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
    
}

const createTransaction = async (req, res) =>{
    
}

module.exports = {
    createItem,
    createClient,
    createInvoice,
    createTransaction
}