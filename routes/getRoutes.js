const express = require('express');
const getController = require('../controllers/getController');

const router = express.Router();

router.get('/create_invoice', getController.getForCreateInvoice);
router.get('/clients', getController.getClients);
router.get('/transaction/:id', getController.getTransactionById);
router.get('/client/:id', getController.getClientById);
router.get('/item', getController.getItems);
router.get('/item/:id', getController.getItemById);
router.get('/:type', getController.getTransactionOfType);

module.exports = router;