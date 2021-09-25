const Transaction = require('../models/Transaction')

// @desc: Get all transactions
// @route: GET /api/v1/transactions
// @access: Public
exports.getTransaction = async (req, res, next) => {
    try {
        const transactions = await Transaction.find( req.query )

        return res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error'
        })
    }
}

// @desc: Add all transactions
// @route: POST /api/v1/transactions
// @access: Private
exports.addTransaction = async (req, res, next) => {
    try {

        const transaction = await Transaction.create(req.body)
    
        return res.status(201).json({
            success: true,
            data: transaction
        })
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message)

            return res.status(400).json({
                success: false,
                error: messages
            })
        } else {
            return res.status(500).json({
                success: false,
                error: 'Server Error'
        })}
    }
}

// @desc: Delete all transactions
// @route: DELETE /api/v1/transactions/delete
// @access: Private
exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.find(req.body)

        if(!transaction) {
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            })
        }

        await transaction[0].deleteOne()

        return res.status(200).json({
            success: true,
            data: {}
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            error: 'Server Error'
    })}

}