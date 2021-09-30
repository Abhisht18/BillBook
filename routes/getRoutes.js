const express = require('express');
const getController = require('../controllers/getController');
const {authent, editor} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/create_invoice',editor, getController.getForCreateInvoice);
router.get('/create_payment',editor, getController.getForCreatePayment);
router.get('/clients',authent, getController.getClients);
router.get('/invoice/:id',authent, getController.getInvoiceById);
router.get('/payment/:id',authent, getController.getPaymentById);
router.get('/client/:id',authent, getController.getClientById);
router.get('/item',authent, getController.getItems);
router.get('/item/:id',authent, getController.getItemById);
router.get('/:type',authent, getController.getTransactionOfType);

module.exports = router;