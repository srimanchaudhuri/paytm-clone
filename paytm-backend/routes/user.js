const express = require('express')
const { userValidation, updateBody } = require('../zodValidation')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const { User, Account } = require('../db')
const { authMiddleware } = require('../middleware')

router.post('/signup', async (req, res) => {
    const username = req.body.username

    const userPayload = req.body

    const parsedPayload = userValidation.safeParse(userPayload)

    if(parsedPayload.error) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const userid = await User.findOne({
        username
    })

    if(userid) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.create(userPayload)

    
    if(!user) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const userId = user._id

    await Account.create({
        userId,
        balance: 1 + Math.random()*10000
    })
    
    const jwtToken = jwt.sign({
        userId:user._id
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: jwtToken
    })

})

router.post('/signin', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = await User.findOne({
        username,
        password
    })

    if(!user) {
        res.status(411).json(
            {
                message: "Error while logging in"
            })
    }

    const jwtToken = jwt.sign({userId: user._id}, JWT_SECRET)
    res.json(
        {
            token: jwtToken
        })
})

router.put('/', authMiddleware, async (req, res) => {
    const body = req.body
    const userId = req.userId

    const {success} = updateBody.safeParse(body)

    if(!success) {
        res.status(411).json({
            message: 'Error while updating information'
        })
    }
    
    await User.updateOne({
        _id: userId
    }, body)

    res.status(200).json({
        message: "Updated successfully"
    })
})

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || ""
    console.log(filter);
    const users = await User.find({ 
        $or:[{
            firstName: {
                "$regex": filter
            }
        },
        {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.status(200).json({
        user: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports=router