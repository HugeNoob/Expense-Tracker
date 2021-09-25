const express = require('express')
const router = express.Router()
const { getTransaction, addTransaction, deleteTransaction } = require('../controllers/transactioncontroller.js')
const auth = require('../middleware/auth')

// Routing GET and POST from /api/v1/transactions
router
    .route('/')
    .get(getTransaction)
    .post(auth, addTransaction)

// Routing DELETE from /api/v1/transactions/...
router
    .route('/delete')
    .delete(auth, deleteTransaction)

module.exports = router