const express = require('express');
const deleteController = require('../controllers/deleteController');

const router = express.Router();

router.delete('/item/:id', deleteController.deleteItem);

module.exports = router;