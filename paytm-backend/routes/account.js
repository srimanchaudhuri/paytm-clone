const express = require('express')
const { authMiddleware } = require('../middleware')
const { Account } = require('../db')
const { default: mongoose } = require('mongoose')
const router = express.Router()

router.get('/balance', authMiddleware, async (req, res) => {
    const userId = req.userId
    const userAccount = await Account.findOne({
        userId: userId
    })

    if(!userAccount) {
        return res.json({
            message:"account not found"
        })
    }
    res.json({
        balance: userAccount.balance
    })
})

router.post('/transfer', authMiddleware, async (req, res) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    const toUserId = req.body.to
    const amount = req.body.amount

    console.log(toUserId);

    const toUser = await Account.findOne({
        _id: toUserId
    }).session(session)

    console.log(`TO USER = ${toUser}`);

    if(!toUser) {
        await session.abortTransaction()
        return res.json({
            message: "Invalid account"
        })
    }

    console.log(`REQ.USERID ====== ${req.userId}`);

    const fromUser = await Account.findOne({
        userId: req.userId
    }).session(session)

    if(fromUser.balance < amount) {
        await session.abortTransaction()
        return res.json({
            message: "Insufficient balance"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    }).session(session)

    await Account.updateOne({
        _id: toUserId
    }, {
        $inc: {
            balance: amount
        }
    }).session(session)

    await session.commitTransaction()
    res.status(200).json({
        message: "Transfer successful"
    })
})

module.exports = router