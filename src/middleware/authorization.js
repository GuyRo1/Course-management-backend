const jwt = require('jsonwebtoken')
const Professor = require('../models/professor')
const Student = require('../models/student')


const studentAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const student = await Student.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!student) {
            throw new Error()
        }
        req.student = student
        next()
    } catch (e) {
        next({ status: 401, message: "No authorization" })
    }
}

const professorAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const professor = await Professor.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!professor) {
            throw new Error()
        }
        req.professor = professor
        next()
    } catch (e) {
        next({ status: 401, message: "No authorization" })
    }

}


module.exports = { studentAuth, professorAuth }