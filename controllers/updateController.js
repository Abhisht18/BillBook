const Client = require('../models/client-model');
const _ = require("lodash");


const updateTransactionById = async(req,res) => {  
    const id = req.params.id;
    let obj = req.body;
    if(obj.amount) obj.amount = _.toNumber(obj.amount);
    Client.find()
        .then(clientData => {
            const trans = clientData[0].transactions;
            const clients = clientData[0].clients;
            let upd = trans.filter(client => client._id == id);
            if(upd.party_name != obj.party_name){
                clients.filter(client => {
                    if(client.party_name == obj.party_name){
                        client.balance -= obj.amount;
                    }
                    if(client.party_name == upd[0].party_name){
                        client.balance += obj.amount;
                    }
                })
            }
            for (const key of Object.entries(obj)) {
                if(key != "amount") upd[0][key] = obj[key];
            }
            clientData[0].save();
            res.json({success: true, updatedTransac: upd[0]});
        })
        .catch(err => {
            console.log(err);
        }) 
}

const updateClientById = async(req, res) => { 
    const id = req.params.id;
    let obj = re.body;
    Client.find()
        .then(clientData => {
            const clients = clientData[0].clients;
            let upd = clients.filter(client => client._id == id);
            for (const key of Object.entries(obj)) {
                upd[0][key] = obj[key];
            }
            clientData[0].save();
            res.json({success: true, updatedClient: upd[0]});
        })
        .catch(err => {
            console.log(err);
        }) 
}

const updateItemById = async(req, res) => {
    const id = req.params.id;
    let obj = req.body;
    if(obj.sales_price) obj.sales_price = _.toNumber(obj.sales_price);
    if(obj.puchase_price) obj.puchase_price = _.toNumber(obj.puchase_price);
    Client.find()
        .then(clientData => {
            const items = clientData[0].items;
            upd = items.filter((item) => item._id == id);
            for (const key of Object.entries(obj)) {
                upd[0][key] = obj[key];
            }
            clientData[0].save();
            res.json({success: true, updatedItem: upd[0]});
        })
        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    updateClientById,
    updateItemById,
    updateTransactionById
}