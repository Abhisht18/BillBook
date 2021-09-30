const Client = require('../models/client-model');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

const createItem = async(req, res)=>{
    const obj = req.body;
    if(obj.stock) obj.stock = _.toNumber(obj.stock);
    else obj.stock = 0;
    if(obj.sales_price) obj.sales_price = _.toNumber(obj.sales_price);
    if(obj.purchase_price) obj.purchase_price = _.toNumber(obj.purchase_price);
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
                return res.json({sucess: false, message: "Client with that name already Exists"});
            }
            else{
                result.clients.push(obj);
                result.save();
                return res.json({success:true, client: result.clients[result.clients.length-1]});    
            }
        })
        .catch(err => {
            console.log(err);
        });
}

const createInvoice = async (req, res) =>{
    const obj = req.body;
    console.log(obj);
    obj.total_bill = _.toNumber(obj.total_bill);
    obj.balance = _.toNumber(obj.balance);               //** */
    obj.invoice_items.map(item => {
        item.quantity = _.toNumber(item.quantity);
    });
    obj.linked_transac = [];
    console.log(obj);
    Client.find()
        .then(clientData => {
            const result = clientData[0];
            result.sales_invoice.push(obj);
            clientData[0].total_sales += obj.total_bill;
            clientData[0].total_paid += obj.total_bill-obj.balance;
            clientData[0].total_unpaid = clientData[0].total_sales - clientData[0].total_paid;
            const newObj = {
                party_name: obj.party_name,
                typ: "Invoice",
                payment_id: obj.invoice_number,
                tot_amount: obj.total_bill,
                date: obj.invoice_date,
                notes: obj.notes
            }
            const client = result.clients.filter(client => client.party_name === obj.party_name);
            client[0].total_amount += obj.total_bill;
            client[0].total_paid_amount += obj.total_bill - obj.balance;
            client[0].balance = -client[0].total_paid_amount + client[0].total_amount;

            const ress = updateToCollect(clientData[0]);
            clientData[0].to_collect = ress[0];
            clientData[0].to_pay = ress[1];
             
            result.transactions.push(newObj);
            result.save();
        })
        .catch(err => {
            console.log(err);
        });
}

const createTransaction = async (req, res) =>{
    const obj = req.body;
    console.log(obj);
    obj.typ = "Payment";
    obj.tot_amount = _.toNumber(obj.tot_amount);
    obj.left_amount = _.toNumber(obj.left_amount); 
    if(!obj.linked_invoice) obj.linked_invoice = [];
    else{
        obj.linked_invoice.map(inv => {
            inv.amount = _.toNumber(inv.amount);
            inv.total_bill = _.toNumber(inv.total_bill);
        })
    }
    Client.find()
        .then(clientData => {
            if(!obj.linked_invoice.length){
                clientData[0].clients.map(client => {
                    if(client.party_name == obj.party_name){
                        client.total_paid_amount += obj.tot_amount;
                        client.balance -= obj.tot_amount;
                    }
                });

                const ress = updateToCollect(clientData[0]);
                clientData[0].to_collect = ress[0];
                clientData[0].to_pay = ress[1];

                clientData[0].transactions.push(obj);
                clientData[0].save;
            }

            else{
                clientData[0].clients.map(client => {
                    if(client.party_name == obj.party_name){
                        client.total_paid_amount += obj.tot_amount;
                        client.balance -= obj.tot_amount;
                    }
                });
                obj.linked_invoice.forEach(link_invoice => {
                    clientData[0].sales_invoice.map(invoice => {
                        if(invoice.invoice_number == link_invoice.invoice_number){
                            clientData[0].total_paid += link_invoice.amount;
                            clientData[0].total_unpaid -= link_invoice.amount;
                            invoice.balance -= link_invoice.amount;
                            invoice.linked_transac.push({
                                payment_id: obj.payment_id,
                                amount: link_invoice.amount 
                            })
                        }
                    })
                });

                const ress = updateToCollect(clientData[0]);
                clientData[0].to_collect = ress[0];
                clientData[0].to_pay = ress[1];

                clientData[0].transactions.push(obj);
                clientData[0].save();
            }
            res.json({success: true, message: "Transaction generated."})
        })
        .catch(err => {
            console.log(err);
        });
}

const createToken = (id) => {
    return jwt.sign({ id }, 'billbook webapp', {
        expiresIn: 24 * 3 * 60 * 60
    });
};

const createCompany = async (req, res) => {
    let obj = req.body;
    if(obj.password.length < 6){
        res.json({success: false, message: "Password should contain atleast 6 elements."});
    }
    const client = new Client;
    client.company_name = obj.company_name;
    client.total_sales=0;
    client.total_paid=0;
    client.total_unpaid=0;
    client.to_collect=0;
    client.to_pay=0;
    client.save();
    const salt = await bcrypt.genSalt();
    obj.password = await bcrypt.hash(obj.password, salt);
    const admin = {email: obj.email, password: obj.password, role: "1"};
    client.users.push(admin);
    client.save();
    const token = createToken(client.users[0]._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
    res.json({success: true});
}

const createUser = async (req, res) => {
    let obj = req.body;
    if(obj.password.length < 6){
        res.json({success: false, message: "Password should contain atleast 6 elements."});
    }
    else{
        Client.find()
            .then(async (clientData) => {
                const exist = clientData[0].users.filter(user => user.email === obj.email);
                if(!exist.length){
                    const salt = await bcrypt.genSalt();
                    obj.password = await bcrypt.hash(obj.password, salt);
                    clientData[0].users.push(obj);
                    // const token = createToken(clientData[0].users[clientData[0].users.length-1]._id);
                    // res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
                    clientData[0].save();
                    res.json({ success: true, user: obj });
                }
                else{
                    res.json({success: false, message: "Input Email already exists. Try Logging In."})
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
}

const loginUser = async (req, res) => {
    let obj = req.body;
    Client.find()
        .then(async (clientData)  => {
            const exist = clientData[0].users.filter(user => user.email === obj.email);
            if(!exist.length){
                res.json({success: false, message: "Email doesn't Exists"});
            }
            else{
                const auth = await bcrypt.compare(obj.password, exist[0].password);
                if(!auth){
                    res.json({success: false, message: "Entered Password does not match"});
                }
                else{
                    const token = createToken(exist[0]._id);
                    res.cookie('jwt', token, { httpOnly: true, maxAge: 3*24*60*60*1000 });
                    res.json({ user: exist });
                }
            }
        })
        .catch( err => {
            console.log(err);
        })
}

module.exports = {
    createItem,
    createCompany,
    createClient,
    createInvoice,
    createTransaction,
    createUser,
    loginUser
}