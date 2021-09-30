const express = require('express');
const deleteController = require('../controllers/deleteController');
const {authent, editor} = require('../middleware/authMiddleware');

const router = express.Router();

router.delete('/item/:id', editor, deleteController.deleteItem);
router.delete('/invoice/:id',editor, deleteController.deleteInvoice);
router.delete('/client/:id',editor, deleteController.deleteClient);
router.delete('/transaction/:id',editor, deleteController.deleteTransaction); // This is for both transaction and invoice

module.exports = router;