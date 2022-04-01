/* eslint-disable global-require */
/* eslint-disable consistent-return */

/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose')

const { Schema } = mongoose

const ModelSchema = Schema({
    skill: { type: Schema.Types.ObjectId, ref: 'Skill' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    deleted: { type: Boolean, default: false },
}, {
    timestamps: true,
})

ModelSchema.pre([
    'find',
    'findOne',
    'countDocuments',
], function () {
    const { withDeleted } = this.options
    if (!withDeleted) {
        this.where({ deleted: false })
    }
})
module.exports = mongoose.model('Training', ModelSchema)
