const Course = require('../models/course')
const Student = require('../models/student')

const addNewCourse = async (req, res, next) => {
    try {
        const course = new Course()
        for (const key in req.body.courseData) {
            course[key] = req.body.courseData[key]
        }
        await course.save()
        res.status(201).send({ course })
    } catch (err) {
        next({ status: 400, message: err })
    }

}

const getCourses = async (req, res, next) => {
    try {
        const match = {}

        if (req.query.nameContains)
            match.name = { $regex: new RegExp(req.query.nameContains, "i") }
        const courses = await Course.find(match)
        return res.send({ courses })

    } catch (err) {
        next({ status: 400, message: "no students" })
    }
}

const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findOne({ _id: req.params.id })
        res.send({ course })
    } catch (err) {
        next({ status: 400, message: "no student with this id" })
    }
}

const deleteCourse = async (req, res, next) => {
    try {
        const filter = { _id: req.params.id }
        const course = await Course.findOneAndDelete(filter)
        if (!course) throw {
            status: 400,
            message: "No student with this id"
        }
        const students = await Course.find({ 'students.student': course._id })
        for (let i = 0; i < students.length; i++) {
            students[i].courses =
                students[i].courses.filter(
                    courseId => courseId !== course._id ? true : false
                )
            await students[i].save()
        }
        res.send({ course })
    } catch (err) {
        next(err)
    }
}

const getCourseSessionData = async (req, res, next) => {
    try {
        const course = await Course.findOne({ _id: req.params.id })
        for (let i = 0; i < course.attendance.length; i++) {
            if (course.attendance[i]._id === req.params.sessionId)
                return res.send({ session: course.attendance[i] })
        }
    } catch (err) {
        next({ status: 400, message: `no session for this course in this date` })
    }

}

const addStudentToCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id
        const studentId = req.params.studentId
        const course = await Course.findOne({ _id: courseId })
        const student = await Student.findOne({ _id: studentId })
        if (!student || !course) throw new Error()

        const studentInTheCourseArray =
            course.students.find(
                student => student === studentId
            )

        const courseAlreadyInStudentArray =
            student.courses.find(
                course => course === courseId
            )

        if (!!studentInTheCourseArray || !!courseAlreadyInStudentArray)
            throw new Error()

        course.students.push({ student: student._id })
        student.courses.push({ course: course._id })

        await course.save()
        await student.save()

        res.send({ message: "added student to the course" })

    } catch (err) {
        console.log(err);
        next(err)
    }
}

const addStudentAttendanceData = async (req, res, next) => {
    try {
        const courseId = req.params.courseId
        const studentId = req.student.id
        const attendanceData = req.body.attendanceData
        const sessionId = req.body.sessionId
        const course = await Course.findOne({ _id: courseId })
        let sessionIndex = -1
        for (let i = 0; i < course.attendance.length; i++) {
            if (course.attendance[i].id === sessionId) {
                sessionIndex = i
            }
        }
        if (sessionIndex === -1) throw new Error("Didn't find the session")
        let studentIndex = -1
        for (let i = 0; i < course.attendance[sessionIndex].students.length; i++) {
            if (course.attendance[sessionIndex].students[i].student.toString() === studentId) {
                studentIndex = i
            }
        }
        if (studentIndex === -1) {
            course.attendance[sessionIndex]
                .students.push({
                    student: studentId,
                    status: attendanceData.status,
                    reason: attendanceData.reason
                })
        } else {
            course.attendance[sessionIndex]
                .students[studentIndex] = {
                student: studentId,
                status: attendanceData.status,
                reason: attendanceData.reason
            }
        }
        await course.save()
        res.send()
    } catch (err) {
        console.log(err);
        next(err)
    }

}

const getStudentsForCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({ _id: req.params.id })
        await course.populate('students.student')
        res.send({ students: course.students })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    addStudentToCourse,
    getCourseSessionData,
    deleteCourse,
    getCourseById,
    addNewCourse,
    getCourses,
    addStudentAttendanceData,
    getStudentsForCourse
}