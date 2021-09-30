const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({

    company_name: String,

    total_sales: Number,
    total_paid: Number,
    total_unpaid: Number,
    to_collect: Number,
    to_pay: Number,

    items: [{
            name: String,
            stock: Number,
            as_of_date: String, 
            sales_price: Number,
            purchase_price: Number,
            hsn_code: String,
            tax: String
        }],

    clients:[{
            party_name: String,
            mobile_number: String,
            email: String,
            billing_address: String,
            shipping_address: String,
            gst_in: String,
            total_amount: Number,
            total_paid_amount: Number,
            balance: Number
        }],

    sales_invoice: [{ 
            party_name: String,
            invoice_number: String,
            invoice_date: String,
            payment_term: String,
            due_date: String,
            invoice_items: [
                {
                    item_name: String,
                    quantity: Number,
                }], 
            total_bill: Number,
            balance: Number,              //* updated this part in create controller. This paid is to keep track for linking trnsactions.
            linked_transac: [
                {
                   payment_id: String,
                   amount: Number 
                }
            ],
            notes: [String]
        }], 

    default_notes:[String],
    tnc: [String],

    transactions: [{
            party_name: String,
            typ: String,
            payment_id: String,
            tot_amount: Number,
            left_amount: Number,
            date: String,
            linked_invoice: [{
                date: String,
                invoice_number: String,
                total_bill: Number,
                amount: Number
            }],
            notes: [String]
        }],

    users: [{
        email: String,
        password: String,
        role: String
    }]
},{ typeKey: '$type' });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;