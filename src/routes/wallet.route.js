const express = require('express');
const router = express.Router();
const walletController = new (require('../controllers/wallet.controller')) ();

router.post('/setup', walletController.setupWallet);
router.get('/wallet/:id', walletController.getWallet);
router.post('/transact/:walletId', walletController.handleTransaction);
router.get('/transactions', walletController.getTransactions);

module.exports = router;
