/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-else-return */
/* eslint-disable func-names */

const mongoose = require('mongoose')
const moment = require('moment-timezone')
const { getQuery } = require('../utils')
const {
    Training,
    Skill
} = require('../models')

const getAllUsingFind = async (data) => {
    const {
        condition,
        pageSize,
        page,
        sortedLk,
        paging,
    } = data

    try {
        let dataList = []
        let totalCount = 0
        if (paging) {
            dataList = await Training
                .find(condition)
                .limit(pageSize)
                .skip(pageSize * page)
                .sort(sortedLk)
                .populate({
                    path: 'skill',
                    select: ['_id', 'skillName']
                })
                .populate({
                    path: 'participants',
                    select: ['_id', 'name', 'profile', 'skill'],
                    populate: [
                        { path: 'skill', select: ['skillName'] },
                    ],
                })
            totalCount = await Training
                .countDocuments(condition)
        }
        else {
            dataList = await Training
                .find(condition)
                .sort(sortedLk)
                .populate({
                    path: 'skill',
                    select: ['_id', 'skillName']
                })
                .populate({
                    path: 'participants',
                    select: ['_id', 'name', 'profile', 'skill'],
                    populate: [
                        { path: 'skill', select: ['skillName'] },
                    ],
                })
        }

        return {
            dataList,
            totalCount,
        }
    }
    catch (err) {
        throw new Error(`getAllUsingFind: ${err.message}`)
    }
}
exports.getAll = async (req, res) => {
    const user = req.headers.tokenDecoded
    if (user.profile !== 'expert') {
        return res.status(401).json({ message: 'You cant access this feature' })
    }

    try {
        const {
            page,
            pageSize,
            filteredLk,
            sortedLk,
            variety,
        } = await getQuery(req.query)

        const condition = {
            ...filteredLk,
        }

        const paging = variety !== 'pageByDate'

        let responseFetching = await getAllUsingFind({
            condition,
            variety,
            pageSize,
            page,
            sortedLk,
            paging,
        })
        let {
            dataList,
            totalCount,
        } = responseFetching
        const data = {
            data: dataList,
            page,
            pageSize: paging ? pageSize : undefined,
            totalPage: paging ? Math.ceil(totalCount / pageSize) : undefined,
            totalData: paging ? totalCount : dataList.length,
        }
        return res.status(200).json({ message: 'success', data })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}
// exports.getAll = async (req, res) => {
//     const user = req.headers.tokenDecoded
//     if (user.profile !== 'expert') {
//         return res.status(401).json({ message: 'You cant access this feature' })
//     }
//     try {

//         const training = await Training.find({ deleted: false })
//             .populate({
//                 path: 'skill',
//                 select: ['_id', 'skillName']
//             })
//             .populate({
//                 path: 'participants',
//                 select: ['_id', 'name', 'profile', 'skill'],
//                 populate: [
//                     { path: 'skill', select: ['skillName'] },
//                 ],
//             }).lean()
//         return res.status(200).json({ message: 'success', data: training })
//     }
//     catch (err) {
//         return res.status(400).json({ message: err.message })
//     }
// }
exports.insert = async (req, res) => {
    const user = req.headers.tokenDecoded
    if (user.profile !== 'expert') {
        return res.status(401).json({ message: 'You cant access this feature' })
    }
    let {
        skill,
        title,
        description,
        startDate,
        endDate,
        participants
    } = req.body

    try {

        if (!title || !startDate || !endDate || !skill) {
            return res.status(422).json({ message: 'Data cannot be processed!' })
        }
        if (!mongoose.Types.ObjectId.isValid(skill)) {
            return res.status(422).json({ message: 'Skill not registered on our system' })
        }
        if (participants !== []) {
            for (let i = 0; i < participants.length; i++) {
                if (!mongoose.Types.ObjectId.isValid(participants[i])) {
                    return res.status(401).json({ message: 'Participants not registered on our system' })
                }
            }
        }
        startDate = moment(startDate).format('DD-MM-YYYY 00:00:00')
        endDate = moment(endDate).format('DD-MM-YYYY 23:59:59')
        if (moment(startDate).diff(endDate) >= 0) {
            return res.status(422).json({ message: 'End date must be greater or equal than start date!' })
        }


        let payloadTraining = {
            skill,
            title,
            description,
            startDate,
            endDate,
            participants
        }
        const training = new Training(payloadTraining)

        training.save()

        return res.status(200).json({ message: 'success', data: payloadTraining })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}


exports.update = async function (req, res) {
    const user = req.headers.tokenDecoded
    if (user.profile !== 'expert') {
        return res.status(401).json({ message: 'You cant access this feature' })
    }
    const { id } = req.params
    const formData = req.body
    try {
        let training = await Training.findOne({ _id: id, deleted: false })
        if (!mongoose.Types.ObjectId.isValid(formData.skill)) {
            return res.status(422).json({ message: 'Skill not registered on our system' })
        }
        if (!formData.title || !formData.startDate || !formData.endDate || !formData.skill) {
            return res.status(422).json({ message: 'Data cannot be processed!' })
        }
        if (formData.participants !== '[]') {
            for (let i = 0; i < formData.participants.length; i++) {
                if (!mongoose.Types.ObjectId.isValid(formData.participants[i])) {
                    return res.status(422).json({ message: 'Participants not registered on our system' })
                }
            }
        }
        trainingUpdate = await Object.assign(training, formData).save()
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }

    return res.status(200).json({ message: 'success', data: trainingUpdate })
}

exports.delete = async (req, res) => {
    const user = req.headers.tokenDecoded
    if (user.profile !== 'expert') {
        return res.status(401).json({ message: 'You cant access this feature' })
    }
    const { id } = req.params

    try {
        const training = await Training.findOne({ _id: id })
        await Object.assign(training, { deleted: true }).save()

        return res.status(200).json({ message: 'Success' })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}
