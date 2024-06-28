const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://srimanchaudhuri:q50uAdKe8D8sUuNH@cluster0.7gr0ss0.mongodb.net/paytm-clone')

const userSchema = mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    firstName: {
        type:String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type:String,
        required: true,
        trim: true,
        maxLength: 50
    },
    password: {
        type:String,
        required: true,
        minLength: 6
    }
})

const User = mongoose.model('User', userSchema)

const accountSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        res: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User,
    Account
}