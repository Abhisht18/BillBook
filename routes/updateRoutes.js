const express = require('express');
const updateController = require('../controllers/updateController');
const {authent, editor} = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/transaction/:id',authent, updateController.updateTransactionById);
router.put('/client/:id',authent, updateController.updateClientById);
router.put('/item/:id',authent, updateController.updateItemById);
// router.put('/invoice/:id',authent, updateController.updateInvoiceById);

module.exports = router;