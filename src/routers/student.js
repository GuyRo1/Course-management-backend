const express = require('express')
const { studentAuth, professorAuth } = require('../middleware/authorization')
const {
    loginStudent,
    checkStudent,
    deleteStudent,
    changePassword,
    changeMyData,
    getStudentById,
    registerStudent,
    getStudents,
    getMyCourses
} = require('../controllers/student')

const router = new express.Router()

router.post('/check', studentAuth, checkStudent)

router.get('', professorAuth, getStudents)

router.get('/:id', professorAuth, getStudentById)

router.post('/login', loginStudent)

router.patch('/me', studentAuth, changeMyData)

router.post('', professorAuth, registerStudent)

router.patch('/me/pass', studentAuth, changePassword)

router.delete('/:id', professorAuth, deleteStudent)

router.get('/me/courses', studentAuth, getMyCourses)

module.exports = router