const express = require('express');
const deleteController = require('../controllers/deleteController');

const router = express.Router();

router.delete('/item/:id', deleteController.deleteItem);
router.delete('/invoice/:id', deleteController.deleteInvoice);
router.delete('/client/:id', deleteController.deleteClient);
router.delete('/transaction/:id', deleteController.deleteTransaction); // This is for both transaction and invoice

module.exports = router;