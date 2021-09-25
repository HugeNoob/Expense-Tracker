const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

// User model
const User = require('../models/User')

// REGISTER
router.post('/register', async (req,res) => {

    // checking if username is already in database
    const usernameExists = await User.findOne({username: req.body.username})
    if(usernameExists) return res.status(400).send('Username already exists.')

    // hash passwords
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create new user
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashPassword
    })

    try {
        const savedUser = await user.save()
        const token = jwt.sign({id: user._id, username: user.username}, process.env.TOKEN_SECRET)
        res.send({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username
            }
        })
    } catch (err) {
        res.status(400).send(err)
    }
})

// LOGIN
router.post('/login', async (req, res) => {

    // checking if username exists
    const user = await User.findOne({username: req.body.username})
    if(!user) return res.status(400).send('Invalid username.')

    // checking if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if(!validPass) return res.status(400).send('Invalid password.')

    // create and assign token
    const token = jwt.sign({id: user._id, username: user.username}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({
        token, 
        user: {
            id: user._id,
            name: user.name,
            username: user.username
        }
    })
})

// @route GET api/v1/users
// @desc GET user data
// @access Private
router.get('/getuser', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
})

module.exports = router;