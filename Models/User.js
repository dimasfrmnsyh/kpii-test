/* eslint-disable global-require */
/* eslint-disable consistent-return */

/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const { Schema } = mongoose
const saltRounds = 10

const ModelSchema = Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    profile: { type: String, enum: ['board', 'expert', 'trainer', 'competitor'], required: true },
    skill: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    token: { type: String },
    deleted: { type: Boolean, default: false },
}, {
    timestamps: true,
})

ModelSchema.pre('save', function (next) {
    const user = this

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next()

    // generate a salt
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err)

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err2, hash) {
            if (err2) return next(err2)

            user.password = hash
            next()
        })
    })
})

ModelSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', ModelSchema)
