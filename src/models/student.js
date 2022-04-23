const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const Schema = mongoose.Schema

const StudentSchema = Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    firstname: {
        type: String,
        required: true,

    },
    lastname: {
        type: String,
        required: true,

    },
    dateofbirth: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    courses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
        }
    }],
},
    {
        timestamps: true
    })

StudentSchema.pre('save', async function (next) {
    const student = this
    if (student.isModified('password')) {
        student.password = await bcrypt.hash(student.password, 8)

    }

    next()
})

StudentSchema.methods.generateAuthToken = async function () {
    try {
        const student = this
        const token = jwt.sign({ _id: student._id.toString() }, process.env.JWT_SECRET)
        student.tokens = student.tokens.concat({ token })
        await student.save()

        return token
    } catch (err) {
        throw err
    }
}

StudentSchema.statics.login = async function (userName, password) {
    try {
        const student = await Student.findOne({ "username": userName })
        if (!student) throw { status: 400, message: "unable to log in" }
        const isMatch = await bcrypt.compare(password, student.password)
        if (!isMatch) throw { status: 400, message: "unable to log in" }
        const token = await student.generateAuthToken()
        return { student, token }
    } catch (err) {
        return null
    }
}

StudentSchema.methods.checkPass = async function (password) {
    const match = await bcrypt.compare(password, this.password)
    return match
}

StudentSchema.statics.sendOutData = function (students) {
    const studentsOut = []
    for (let i = 0; i < students.length; i++) {
        studentsOut.push(students[i].sendOutData())
    }
    return studentsOut
}

StudentSchema.methods.sendOutData = function () {
    const student = {}
    student.username = this.username
    student.email = this.email
    student.firstname = this.firstname
    student.lastname = this.lastname
    student.dateofbirth = this.dateofbirth
    student.id = this._id
    return student
}

const Student = mongoose.model('Student', StudentSchema)

module.exports = Student