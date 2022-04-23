const Student = require('../models/student')
const Course = require('../models/course')

async function checkStudent(req, res, next) {
    res.send({ status: 200, user: req.student.sendOutData() })
}
async function loginStudent(req, res, next) {
    try {

        if (!req.body.username || !req.body.password) throw {}
        const { student, token } = await Student.login(req.body.username, req.body.password)
        if (!token) throw new Error('')
        res.send({ status: 200, user: student.sendOutData(), token: token })
    } catch (err) {
        next({ status: 400, message: "could not log in" })
    }
}

const registerStudent = async (req, res, next) => {
    try {
        const student = new Student()
        for (const key in req.body.studentData) {
            student[key] = req.body.studentData[key]
        }
        await student.save()
        res.status(201).send({ student: student.sendOutData() })
    } catch (err) {
        next({ status: 400, message: err })
    }

}

const getStudents = async (req, res, next) => {
    try {
        let students = []
        let searchFlag = false
        let allStudents = []
        let firstNameStudents = [], lastNameStudents = []
        let foundStudents = new Set()
        let match = {}
        if (req.query.firstNameContains) {
            match.firstname = { $regex: new RegExp(req.query.firstNameContains, "i") }
            searchFlag = true;
        }

        if (req.query.lastNameContains) {
            match.lastname = { $regex: new RegExp(req.query.lastNameContains, "i") }
            searchFlag = true;
        }

        if (searchFlag) {
            students = await Student.find(match)
            return res.send({ students: Student.sendOutData(students) })
        }

        if (req.query.nameContains) {
            match.firstname = { $regex: new RegExp(req.query.nameContains, "i") }
            firstNameStudents = students = await Student.find(match)
            match = {}
            match.lastname = { $regex: new RegExp(req.query.nameContains, "i") }
            lastNameStudents = await Student.find(match)
            allStudents = allStudents.concat(firstNameStudents)
            allStudents = allStudents.concat(lastNameStudents)

            students = []
            for (let i = 0; i < allStudents.length; i++) {
                if (!foundStudents.has(allStudents[i].username)) {
                    students.push(allStudents[i])
                    foundStudents.add(allStudents[i].username)
                }
            }
            return res.send({ students: Student.sendOutData(students) })
        }
        students = await Student.find()
        return res.send({ students: Student.sendOutData(students) })

    } catch (err) {
        next({ status: 400, message: "no students" })
    }
}

const getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findOne({ _id: req.params.id })

        res.send({ student: student.sendOutData() })
    } catch (err) {
        next({ status: 400, message: "no student with this id" })
    }
}

const changePassword = async (req, res, next) => {
    try {
        const passMatch = await req.student.checkPass(req.body.password)
        if (!passMatch) throw "could'nt change password"
        req.student.password = req.body.newPassword
        await req.student.save()
        res.send({ message: "password was changed successfully" })
    } catch (err) {
        next(err)
    }
}

const changeMyData = async (req, res, next) => {
    try {

        if (req.body.userId === req.student.id) {
            req.student.username = req.body.username
            req.student.email = req.body.email
            req.student.firstname = req.body.firstname
            req.student.lastname = req.body.lastname
            await req.student.save()
            res.send({ user: req.student.sendOutData() })
        } else {
            throw new Error()
        }

    } catch (err) {
        next(err)
    }
}

const deleteStudent = async (req, res, next) => {
    try {
        const filter = { _id: req.params.id }
        const student = await Student.findOneAndDelete(filter)
        if (!student) throw { status: 400, message: "No student with this id" }
        const courses = await Course.find({ 'students.student': student._id })
        for (let i = 0; i < courses.length; i++) {
            courses[i].students = courses[i].students.filter(studentId => studentId !== student._id ? true : false)
            await courses[i].save()
        }
        res.send({ student: student.sendOutData() })
    } catch (err) {
        next(err)
    }
}

const getMyCourses = async (req, res, next) => {
    try {
        const student = await Student.findOne({ _id: req.student._id })
        await student.populate('courses.course')
        res.send({ courses: Course.sendDataToStudent(student.courses,student.id) })
    } catch (err) {
        console.log(err);
        next(err)
    }
}

module.exports = {
    loginStudent,
    checkStudent,
    deleteStudent,
    changePassword,
    changeMyData,
    getStudentById,
    registerStudent,
    getStudents,
    getMyCourses
}