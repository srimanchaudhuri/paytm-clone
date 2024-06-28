const zod = require('zod')

const userValidation = zod.object({
    firstName: zod.string().min(3).max(30),
    lastName: zod.string().min(3).max(30),
    username: zod.string().email(),
    password: zod.string().min(6)
})

const updateBody = zod.object({
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
    password: zod.string().optional()
})

module.exports = {userValidation, updateBody}