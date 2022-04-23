const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const Schema = mongoose.Schema

const ProfessorSchema = Schema({
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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
},
    {
        timestamps: true
    })

ProfessorSchema.pre('save', async function (next) {
    const professor = this
    if (professor.isModified('password')) {
        professor.password = await bcrypt.hash(professor.password, 8)
    }

    next()
})


ProfessorSchema.methods.generateAuthToken = async function () {
    try {
        const professor = this
        const token = jwt.sign({ _id: professor._id.toString() }, process.env.JWT_SECRET)
        professor.tokens = professor.tokens.concat({ token })
        await professor.save()
        return token
    } catch (err) {
        throw err
    }
}

ProfessorSchema.methods.sendOutData = function () {
    const professor = {}
    professor.id = this._id
    professor.username = this.username
    professor.email = this.email
    professor.firstname = this.firstname
    professor.lastname = this.lastname
    return professor
}

ProfessorSchema.statics.login = async function (userName, password) {
    try {
        const professor = await Professor.findOne({ "username": userName })
        if (!professor) throw { status: 400, message: "unable to log in" }
        const isMatch = await bcrypt.compare(password, professor.password)
        if (!isMatch) throw { status: 400, message: "unable to log in" }
        const token = await professor.generateAuthToken()
        return { professor, token }
    } catch (err) {
        return null
    }
}

ProfessorSchema.methods.checkPass = async function (password) {
    const match = await bcrypt.compare(password, this.password)
    return match
}

const Professor = mongoose.model('Professor', ProfessorSchema)

module.exports = Professor