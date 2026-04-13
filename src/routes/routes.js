const express = require('express');
const homeController = require('../controllers/homeController');
const loginController = require('../controllers/loginController');

const router = express.Router();

// Rota principal da home.
router.get('/', homeController.index);

//rota login
router.get('/login', loginController.index);


module.exports = router;
