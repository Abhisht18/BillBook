const Client = require('../models/client-model');
const _ = require("lodash");

const updateToCollect = (objectt) => {
    const array = [0,0];
    objectt.clients.forEach(client => {
        if(client.total_amount > client.total_paid_amount){
            array[0] += client.total_amount - client.total_paid_amount;
        }
        else{
            array[1] -= client.total_amount - client.total_paid_amount;
        }
    })
    return array;
}

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
            let name = "";
            clientData[0].clients.map(client => {
                if(client._id == id){
                    clientData[0].total_sales -= client.total_amount;
                    if(client.total_paid_amount > client.total_amount) clientData[0].to_pay -= client.total_paid_amount - client.total_amount;
                    else clientData[0].to_collect += client.total_paid_amount - client.total_amount;
                    name = client.party_name;
                }
            });

            clientData[0].sales_invoice.map(invoice => {
                if(invoice.party_name == name){
                    clientData[0].total_paid -= invoice.total_bill - invoice.balance;
                    clientData[0].total_unpaid -= invoice.balance;
                }
            })

            const deletedClient = clientData[0].clients.filter(client => client._id != id); 
            const deletedInvoice = clientData[0].sales_invoice.filter(invoice => invoice.party_name != name); 
            const deletedTransaction = clientData[0].transactions.filter(transaction => transaction.party_name != name); 
            clientData[0].clients = [...deletedClient];
            clientData[0].sales_invoice = [...deletedInvoice];
            clientData[0].transactions = [...deletedTransaction];
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
            clientData[0].sales_invoice.map(invoice => {
                if(invoice.invoice_number == id ){
                    if(invoice.linked_transac.length){
                        res.json({success: false, message: "First delete all the linked transactions."})
                    }
                    else{
                        clientData[0].total_sales -= invoice.total_bill;
                        clientData[0].total_paid -= invoice.total_bill - invoice.balance;
                        clientData[0].total_unpaid -= invoice.balance;

                        clientData[0].clients.map(client => {
                            if(client.party_name == invoice.party_name){
                                client.total_amount -= invoice.total_bill;
                                client.total_paid_amount -= (invoice.total_bill - invoice.balance);
                                client.balance = client.total_amount-client.total_paid_amount;
                            }
                        })
                    }
                }
            })
            const deleted = clientData[0].sales_invoice.filter(invoice => invoice.invoice_number != id); 
            clientData[0].sales_invoice = [...deleted];

            const ress = updateToCollect(clientData[0]);
            clientData[0].to_collect = ress[0];
            clientData[0].to_pay = ress[1];

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
            clientData[0].transactions.map(trans => {
                if(trans.payment_id == id){
                    clientData[0].clients.map(client => {
                        if(client.party_name == trans.party_name){
                            client.total_paid_amount -= trans.tot_amount;
                            client.balance += trans.tot_amount;
                        }
                    });
                    trans.linked_invoice.map(inv => {
                        clientData[0].sales_invoice.map(invoice => {
                            if(invoice.invoice_number == inv.invoice_number){
                                invoice.balance += inv.amount;
                                const del = invoice.linked_transac.filter(transac => transac.payment_id != id);
                                invoice.linked_transac = [...del];
                                clientData[0].total_paid -= inv.amount;
                                clientData[0].total_unpaid += inv.amount;
                            }
                        })
                    })
                }
            })

            const deleted = clientData[0].transactions.filter(transaction => transaction.payment_id != id); 
            clientData[0].transactions = [...deleted];

            const ress = updateToCollect(clientData[0]);
            clientData[0].to_collect = ress[0];
            clientData[0].to_pay = ress[1];

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