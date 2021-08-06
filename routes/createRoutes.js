const express = require('express');
const createController = require('../controllers/createController');

const router = express.Router();

router.get('/invoice', createController.get_createInvoice);
router.post('/item', createController.createItem);
router.post('/client', createController.createClient);

module.exports = router;

            // const result = await Client.findById(id, err => {if(err) console.log(err);});
            // const exist = result.items.filter(item => item.name == req.body.name);
            // // console.log(exist);
            // if(exist.length){
            //     return res.json({sucess: false, message: "Item with that name already Exists"});
            // }
            // else{
            //     result.items.push(obj);
            //     await result.save();
            //     return res.json({success:true, item: result.items[result.items.length-1]});    
            // }