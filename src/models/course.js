const mongoose = require('mongoose')
const {
    validateName,
    validateDayInWeek,
    validateHour,
    validateMinute,
    validateDateOnly,
    validateDayInMonth,
    validateMonth,
    validateYear,
    validateAttendanceStatus

} = require('../utility/validation');

const Schema = mongoose.Schema

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true,
       
    },
    startdate: {
        type: String,
        required: true,
      

    },
    enddate: {
        type: String,
        required: true,
    

    },
    daysofweek: [{
        day: {
            type: Number,
            required: true,
        }
    }],
    attendance: [{
        date: {
            type: String,
            required: true,
        },
        students: [{
            student: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Student',
            },
            status: {
                type: String,
                required: true,
            },
            reason: {
                type: String,
                required: true
            }

        }]
    }],
    starttime: {
        hour: {
            type: String,
            require: true,
        },
        minute: {
            type: String,
            require: true,
         
        }
    },
    endtime: {
        hour: {
            type: String,
            require: true,
        },
        minute: {
            type: String,
            require: true,
          
        }
    },
    students: [{
        student: {

            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student',
        }
    }],
}, {
    timestamps: true
})

CourseSchema.statics.sendDataToStudent = function (courses, studentId) {

    const getAttendanceDataForStudent = (attendance, studentId) => {
        const attendanceForStudent = []
        for (let i = 0; i < attendance.length; i++) {
            const attendanceObj = {}
            attendanceObj.date = attendance[i].date
            const attDate = new Date(attendanceObj.date)
            if (attDate < Date.now()) {
                let attendanceData = {
                    status: "pending",
                    reason: "pending"
                }
                for (let j = 0; j < attendance[i].students.length; j++) {
                    if (attendance[i].students[j].student.toString() === studentId) {
                        attendanceData = {
                            status: attendance[i].students[j].status,
                            reason: attendance[i].students[j].reason
                        }
                    }
                }
                attendanceObj.data = attendanceData
                attendanceObj.key = attendance[i]._id
                attendanceForStudent.push(attendanceObj)
            }
        }
        return attendanceForStudent
    }


    const coursesOut = []
    for (let i = 0; i < courses.length; i++) {

        coursesOut.push({
            id: courses[i].course._id,
            daysofweek: courses[i].course.daysofweek,
            attendance: getAttendanceDataForStudent(courses[i].course.attendance, studentId),
            name: courses[i].course.name,
            startdate: courses[i].course.startdate,
            enddate: courses[i].course.enddate
        })
    }
    return coursesOut
}

CourseSchema.pre('save', async function (next) {

    const course = this
    if (!!course.attendance) 
        return next()
    const startDate = new Date(course.startdate)
    const endDate = new Date(course.enddate)
    if (endDate <= startDate)
        throw new Error

    course.attendance = []
    let currentDate = new Date(startDate)
    const days = []
    for (const day of course.daysofweek) {
        days.push(day.day)
    }
    for (; currentDate <= endDate; currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))) {


        if (days.includes(currentDate.getDay()))
            course.attendance.push({
                date: currentDate,
                students: []
            })
    }

    next()
})

const Course = mongoose.model('Course', CourseSchema)

module.exports = Course