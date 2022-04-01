/* eslint-disable global-require */
/* eslint-disable consistent-return */

/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose')

const { Schema } = mongoose

const ModelSchema = Schema({
    skillName: { type: String, required: true },
    deleted: { type: Boolean, default: false },
}, {
    timestamps: true,
})

module.exports = mongoose.model('Skill', ModelSchema)
