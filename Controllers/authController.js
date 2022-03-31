/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-else-return */
/* eslint-disable func-names */

const mongoose = require('mongoose')
const basicToken = require('basic-auth-token');

const {
    User,
} = require('../models')


exports.login = async (req, res) => {
    const {
        username,
        password,
        tokenfcm,
        device,
    } = req.body

    try {
        // find user
        const user = await User.findOne({
            $or: [
                { username },
                { email: username },
                { phone: username },
            ],
        }).select('+password')
            .select('+tokenfcm')
            .select('+token')

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' })
        }


        // eslint-disable-next-line prefer-arrow-callback
        await user.comparePassword(password, async function (err, isMatch) {
            if (err) throw err

            if (isMatch) {
                // Passwords match
                const userObj = { ...user._doc }
                delete userObj.password
                delete userObj.token
                // generate token
                const token = basicToken(username, password)
                console.log(token)
                // update data
                await Object.assign(user, {
                    tokenfcm,
                    token,
                    device,
                }).save()

                return res.status(200).json({
                    message: 'success',
                    user: {
                        ...userObj,
                    },
                    token,
                })
            }
            else {
                // Passwords don't match
                return res.status(401).json({ message: 'Invalid Login!' })
            }
        })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

exports.logout = async (req, res) => {
    const { user } = req.headers.tokenDecoded
    try {
        // find user
        const myUser = await User.findById(user._id)

        if (!myUser) {
            return res.status(404).json({ message: 'User tidak ditemukan' })
        }

        // update token fcm
        await Object.assign(myUser, {
            token: null,
        }).save()

        return res.status(200).json({ message: 'success' })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

exports.register = async (req, res) => {
    const user = req.headers.tokenDecoded
    const {
        username,
        email,
        password,
        name,
        profile,
        skill,
    } = req.body

    try {

        const isExistEmail = await User.findOne({ email })
        if (isExistEmail) {
            return res.status(400).json({ message: 'Email already used' })
        }

        const isExistUsername = await User.findOne({ username })
        if (isExistUsername) {
            return res.status(400).json({ message: 'Username already used' })
        }

        const payloadUser = {
            username,
            email,
            password,
            name,
            profile,
            skill,
        }

        const user = new User(payloadUser)


        user.save()

        return res.status(200).json({ message: 'success' })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

exports.checkAvailableUsername = async (req, res) => {
    const { value } = req.query

    try {
        await validation.checkAvailableUsername.validate({ username: value })

        const user = await User.findOne({
            username: value,
        })

        if (user) return res.status(404).json({ message: 'Username sudah digunakan' })
        else return res.status(200).json({ message: 'Username tersedia' })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

exports.checkAvailableEmail = async (req, res) => {
    const { value } = req.query

    try {
        await validation.checkAvailableEmail.validate({ email: value })

        const user = await User.findOne({
            email: value,
        })
        if (user) return res.status(404).json({ message: 'Email sudah digunakan' })
        else return res.status(200).json({ message: 'Email tersedia' })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

exports.checkAvailablePhone = async (req, res) => {
    const { value } = req.query

    try {
        await validation.checkAvailablePhone.validate({ phone: value })

        const user = await User.findOne({
            phone: value,
        })
        if (user) return res.status(404).json({ message: 'No telepon sudah digunakan' })
        else return res.status(200).json({ message: 'No telepon tersedia' })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}
