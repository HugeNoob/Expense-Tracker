const mongoose = require('mongoose')

// Creating schema for transaction
const TransactionSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: [true, 'userid missing.']
    },
    id: {
        type: Number,
        required: [true, 'Please add an id.']
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Please add a category.']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add a description.']

    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount.']
    },
    date: {
        type: String,
        required: [true, 'Please add a date.']
    }
})

module.exports = mongoose.model('Transaction', TransactionSchema)