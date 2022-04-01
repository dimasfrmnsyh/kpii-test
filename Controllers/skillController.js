/* eslint-disable eqeqeq */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-else-return */
/* eslint-disable func-names */

const mongoose = require('mongoose')

const {
    Skill,
} = require('../models')

exports.getAll = async (req, res) => {
    const user = req.headers.tokenDecoded
    
    try {
        
        const skill = await Skill.find()
        return res.status(200).json({ message: 'success' ,data: skill})
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}
exports.insert = async (req, res) => {
    const user = req.headers.tokenDecoded
    const {
        skillName,
    } = req.body

    try {

        if(!skillName){
            return res.status(422).json({ message: 'Data cannot be processed!' })
        }
     
        const payLoadSkill = {
            skillName
        }
        
        const skill = new Skill(payLoadSkill)


        skill.save()

        return res.status(200).json({ message: 'success',data: skill })
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}
