const express = require('express')
const { professorAuth, studentAuth } = require('../middleware/authorization')
const {
    // getCourseSessionData,
    deleteCourse,
    getCourseById,
    addNewCourse,
    getCourses,
    addStudentToCourse,
    addStudentAttendanceData,
    getStudentsForCourse
} = require('../controllers/course')


const router = new express.Router()

router.get('/:id', professorAuth, getCourseById)

router.get('/:id/students',professorAuth,getStudentsForCourse)

router.post('', professorAuth, addNewCourse)

router.patch('/:id/:studentId', professorAuth, addStudentToCourse)

router.get('', professorAuth, getCourses)

router.delete('/:id', professorAuth, deleteCourse)

// router.get('/:id/:sessionId', professorAuth, getCourseSessionData)

router.patch('/me/:courseId/:sessionId', studentAuth, addStudentAttendanceData)



module.exports = router