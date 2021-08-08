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

module.exports = {
    deleteItem,
}