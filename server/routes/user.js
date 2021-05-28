
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');



// view users from usercontroller.js
router.get('/', userController.view);
router.post('/', userController.find);

router.get('/adduser', userController.form); // get form to render
router.post('/adduser', userController.create);  // post form data

router.get('/edituser/:id', userController.edit); // edit
router.post('/edituser/:id', userController.update); // update

router.get('/:id', userController.delete);  // delete
router.get('/viewuser/:id', userController.viewall);


// router
router.get('/', (req, res)=>{
    res.render('home'); // we don't need to say .hbs
})


module.exports = router;